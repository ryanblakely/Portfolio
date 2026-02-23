'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface HalftoneAvatarProps {
  imageSrc: string;
  width?: number;
  height?: number;
  className?: string;
}

const VERTEX_SHADER = `
precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

uniform float u_mouseActive;
uniform float u_mouseActivation;
uniform vec2 u_laggedMouse;
uniform float u_time;

void main() {
  vec4 position = a_position;

  if (u_mouseActive > 0.5) {
    vec2 screenPos = position.xy;
    vec2 mouseScreenPos = vec2(
      (u_laggedMouse.x - 0.5) * 2.0,
      (0.5 - u_laggedMouse.y) * 2.0
    );

    float distanceToMouse = length(screenPos - mouseScreenPos);
    float displacementRadius = 1.0;
    float displacementStrength = 0.03;

    float influence = 0.5 / (1.0 + distanceToMouse * distanceToMouse * 2.0);
    float radiusFalloff = 1.0 - smoothstep(displacementRadius * 0.6, displacementRadius, distanceToMouse);

    float edgeDistanceX = min(abs(screenPos.x), 1.0 - abs(screenPos.x));
    float edgeDistanceY = min(abs(screenPos.y), 1.0 - abs(screenPos.y));
    float edgeDistance = min(edgeDistanceX, edgeDistanceY);

    float edgeFalloff = edgeDistance > 0.05 ? smoothstep(0.05, 0.2, edgeDistance) : 0.0;

    influence = influence * displacementStrength * radiusFalloff * edgeFalloff * u_mouseActivation;

    if (influence > 0.001) {
      vec2 pushDirection = distanceToMouse > 0.01 ? normalize(screenPos - mouseScreenPos) : vec2(0.0);
      float timeVariation = sin(u_time * 3.0 + distanceToMouse * 10.0) * 0.1 + 1.0;
      position.xy += pushDirection * influence * timeVariation;
    }
  }

  gl_Position = position;
  v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouseVelocity;
uniform float u_mouseActive;
uniform vec2 u_laggedMouse;

varying vec2 v_texCoord;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 83758.5453123);
}

void main() {
  vec2 pixelCoord = v_texCoord * u_resolution;
  vec2 mousePixel = u_laggedMouse * u_resolution;

  float dotSizePixels = 4.4;
  float spacingPixels = 8.4;

  vec2 gridCount = floor(u_resolution / spacingPixels);
  vec2 gridOffset = (u_resolution - gridCount * spacingPixels) * 0.5;
  vec2 adjustedPixelCoord = pixelCoord - gridOffset;

  vec2 originalGridPos = floor(adjustedPixelCoord / spacingPixels) * spacingPixels + spacingPixels * 0.5;
  vec2 gridPos = originalGridPos;
  vec2 offset = adjustedPixelCoord - gridPos;
  float dist = length(offset);

  vec2 originalGridUV = (originalGridPos + gridOffset) / u_resolution;

  vec4 gridColor = vec4(0.95, 0.95, 0.95, 1.0);
  if (originalGridUV.x >= 0.0 && originalGridUV.x <= 1.0 && originalGridUV.y >= 0.0 && originalGridUV.y <= 1.0) {
    gridColor = texture2D(u_texture, originalGridUV);
  }

  float brightness = (gridColor.r + gridColor.g + gridColor.b) / 3.0;

  float baseDotSize = dotSizePixels * smoothstep(0.0, 1.06, (1.0 - brightness));

  float adjustedDotSize = baseDotSize;

  float circle = 0.0;

  vec2 originalDotCenter = originalGridPos;
  vec2 adjustedOriginalDotCenter = originalDotCenter - gridOffset;
  if (adjustedOriginalDotCenter.x >= 0.0 && adjustedOriginalDotCenter.x < gridCount.x * spacingPixels &&
      adjustedOriginalDotCenter.y >= 0.0 && adjustedOriginalDotCenter.y < gridCount.y * spacingPixels) {
    circle = 1.0 - smoothstep(adjustedDotSize - 0.5, adjustedDotSize + 0.5, dist);

    float distFromLeftEdge = pixelCoord.x;
    float distFromRightEdge = u_resolution.x - pixelCoord.x;
    float distFromTopEdge = pixelCoord.y;
    float distFromBottomEdge = u_resolution.y - pixelCoord.y;

    float distFromEdge = min(min(distFromLeftEdge, distFromRightEdge),
                            min(distFromTopEdge, distFromBottomEdge));

    vec2 gridCoord = floor((originalGridPos + gridOffset) / spacingPixels);
    float fadeZoneSize = random(gridCoord + vec2(123.45, 678.90)) * u_resolution.y * 0.2;
    float edgeFactor = clamp(distFromEdge / fadeZoneSize, 0.0, 1.0);
    float edgeNoise = random(gridCoord);
    float showProbability = edgeFactor * 0.8 + 0.2;

    vec2 dotCenter = originalGridPos + gridOffset;
    vec2 laggedMousePixel = u_laggedMouse * u_resolution;
    float mouseDistance = length(dotCenter - laggedMousePixel);

    float velocityMagnitude = length(u_mouseVelocity);
    float baseRadius = 470.0;
    float velocityRadius = velocityMagnitude * 20.0;
    float totalRadius = baseRadius + velocityRadius;

    float mouseInfluence = 0.0;
    if (mouseDistance < totalRadius && u_mouseActive > 0.5) {
      mouseInfluence = 0.75 - (mouseDistance / totalRadius);
    }

    vec2 mouseHideCoord = floor((originalGridPos + gridOffset) / spacingPixels);
    float mouseHideNoise = random(mouseHideCoord + vec2(9.87, 6.54));

    float baseHideProbability = mouseInfluence * 0.8 * u_mouseActive;
    float velocityBoost = min(velocityMagnitude * 2.0, 1.0);

    float impactSeed = random(mouseHideCoord + vec2(2.34, 7.89));
    float recoveryTime = 0.1 + impactSeed * 1.0;
    float recoveryWave = sin(u_time / recoveryTime + impactSeed * 6.28) * 0.5 + 0.5;

    float hideProbability = baseHideProbability * (1.0 + velocityBoost) * (1.0 - recoveryWave * 0.7);

    if (edgeNoise > showProbability) {
      circle = 0.0;
    } else {
      float mouseFadeOut = 1.0;
      if (mouseHideNoise < 0.5) {
        float sizeFactor = adjustedDotSize / dotSizePixels;
        float baseFadeDuration = 0.5;
        float sizeFadeDuration = baseFadeDuration + sizeFactor * 1.0;

        float fadeSpeed = mouseInfluence * 3.0;
        float fadeProgress = clamp(fadeSpeed - recoveryWave * 2.0, 0.0, 1.0);

        mouseFadeOut = 1.0 - smoothstep(0.0, sizeFadeDuration, fadeProgress * sizeFadeDuration);
      }

      circle *= mouseFadeOut;

      float sizeBasedDelay = (adjustedDotSize / dotSizePixels) * 1.5;
      float randomOffset = random(gridCoord + vec2(456.78, 901.23)) * 0.75;
      float animationDelay = sizeBasedDelay + randomOffset;
      float animationDuration = 0.1;
      float animationStart = animationDelay;
      float animationEnd = animationDelay + animationDuration;

      float fadeIn = smoothstep(animationStart, animationEnd, u_time);

      circle *= fadeIn;
    }
  }

  vec4 dotColor = vec4(0.0, 0.0, 0.0, 0.47);
  vec4 finalColor = vec4(dotColor.rgb * circle, circle * dotColor.a);

  gl_FragColor = finalColor;
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function loadTexture(
  gl: WebGLRenderingContext,
  url: string,
  onLoad?: () => void,
): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  );

  const image = new window.Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    onLoad?.();
  };

  image.src = url;

  return texture;
}

let hasMountedOnce = false;

export function HalftoneAvatar({
  imageSrc,
  width = 120,
  height = 120,
  className,
}: HalftoneAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(0);
  const mouseActivationRef = useRef(0);
  const laggedMouseRef = useRef({ x: 0.5, y: 0.5 });
  const lastTimeRef = useRef(performance.now());
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const dpr = (window.devicePixelRatio || 1) * 2;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const gl = canvas.getContext('webgl', { premultipliedAlpha: false });
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const dotSpacing = 8.4;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const gridCountX = Math.floor(canvasWidth / dotSpacing);
    const gridCountY = Math.floor(canvasHeight / dotSpacing);
    const gridOffsetX = (canvasWidth - gridCountX * dotSpacing) * 0.5;
    const gridOffsetY = (canvasHeight - gridCountY * dotSpacing) * 0.5;

    const positions: number[] = [];
    const texCoords: number[] = [];
    const dotRadius = 4.4;

    for (let gy = 0; gy < gridCountY; gy++) {
      for (let gx = 0; gx < gridCountX; gx++) {
        const cx = gridOffsetX + gx * dotSpacing + dotSpacing * 0.5;
        const cy = gridOffsetY + gy * dotSpacing + dotSpacing * 0.5;

        const ndcX = (cx / canvasWidth) * 2 - 1;
        const ndcY = 1 - (cy / canvasHeight) * 2;
        const rX = (dotRadius / canvasWidth) * 2;
        const rY = (dotRadius / canvasHeight) * 2;

        const uvX = cx / canvasWidth;
        const uvY = cy / canvasHeight;

        positions.push(
          ndcX - rX,
          ndcY - rY,
          ndcX + rX,
          ndcY - rY,
          ndcX - rX,
          ndcY + rY,
          ndcX - rX,
          ndcY + rY,
          ndcX + rX,
          ndcY - rY,
          ndcX + rX,
          ndcY + rY,
        );

        texCoords.push(uvX, uvY, uvX, uvY, uvX, uvY, uvX, uvY, uvX, uvY, uvX, uvY);
      }
    }

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(positions),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(texCoords),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Use a fullscreen quad instead for the fragment shader approach
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0, 1, 1, 1, 0, 0,
        0, 0, 1, 1, 1, 0,
      ]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseVelocityLocation = gl.getUniformLocation(
      program,
      'u_mouseVelocity',
    );
    const mouseActiveLocation = gl.getUniformLocation(
      program,
      'u_mouseActive',
    );
    const mouseActivationLocation = gl.getUniformLocation(
      program,
      'u_mouseActivation',
    );
    const laggedMouseLocation = gl.getUniformLocation(
      program,
      'u_laggedMouse',
    );

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    let textureLoaded = false;
    loadTexture(gl, imageSrc, () => {
      textureLoaded = true;
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
      mouseActiveRef.current = 1;
    };

    const handleMouseLeave = () => {
      mouseActiveRef.current = 0;
    };

    if (!prefersReducedMotion) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    const skipFadeIn = hasMountedOnce;
    hasMountedOnce = true;
    const startTime = performance.now();
    // If not the initial page load, offset time past the fade-in duration
    const timeOffset = skipFadeIn ? 3.0 : 0;

    const render = () => {
      if (!textureLoaded) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const elapsed = (now - startTime) / 1000 + timeOffset;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const lagFactor = 0.15;
      laggedMouseRef.current.x +=
        (mouseRef.current.x - laggedMouseRef.current.x) * lagFactor;
      laggedMouseRef.current.y +=
        (mouseRef.current.y - laggedMouseRef.current.y) * lagFactor;

      const targetActivation = mouseActiveRef.current;
      mouseActivationRef.current +=
        (targetActivation - mouseActivationRef.current) * 0.1;

      velocityRef.current.x =
        (mouseRef.current.x - laggedMouseRef.current.x) / Math.max(dt, 0.001);
      velocityRef.current.y =
        (mouseRef.current.y - laggedMouseRef.current.y) / Math.max(dt, 0.001);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(
        mouseVelocityLocation,
        velocityRef.current.x,
        velocityRef.current.y,
      );
      gl.uniform1f(mouseActiveLocation, mouseActiveRef.current);
      gl.uniform1f(mouseActivationLocation, mouseActivationRef.current);
      gl.uniform2f(
        laggedMouseLocation,
        laggedMouseRef.current.x,
        laggedMouseRef.current.y,
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (prefersReducedMotion) {
        return;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [imageSrc, width, height]);

  if (!webglSupported) {
    return (
      <Image
        src={imageSrc}
        alt="Ryan Blakely"
        width={width}
        height={height}
        className={className}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
        priority
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        backgroundColor: 'transparent',
        width: `${width}px`,
        height: `${height}px`,
        imageRendering: 'crisp-edges',
      }}
    />
  );
}
