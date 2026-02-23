'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { getDefaults } from './shaderParams';

interface TunableShaderCanvasProps {
  imageSrc: string;
  width?: number;
  height?: number;
  className?: string;
  paramsRef: React.RefObject<Record<string, number>>;
  vertexShader: string;
  fragmentShader: string;
  uniformNames: string[];
}

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

export function TunableShaderCanvas({
  imageSrc,
  width = 120,
  height = 120,
  className,
  paramsRef,
  vertexShader: vertexShaderSource,
  fragmentShader: fragmentShaderSource,
  uniformNames,
}: TunableShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(0);
  const mouseActivationRef = useRef(0);
  const laggedMouseRef = useRef({ x: 0.5, y: 0.5 });
  const lastTimeRef = useRef(performance.now());
  const [webglSupported, setWebglSupported] = useState(true);

  const defaults = getDefaults();
  const dprMultiplier = paramsRef.current?.dprMultiplier ?? defaults.dprMultiplier;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const dpr = (window.devicePixelRatio || 1) * dprMultiplier;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const gl = canvas.getContext('webgl', { premultipliedAlpha: false });
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    const positionBuffer = gl.createBuffer();
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

    const texCoordBuffer = gl.createBuffer();
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

    // Built-in uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseVelocityLocation = gl.getUniformLocation(program, 'u_mouseVelocity');
    const mouseActiveLocation = gl.getUniformLocation(program, 'u_mouseActive');
    const mouseActivationLocation = gl.getUniformLocation(program, 'u_mouseActivation');
    const laggedMouseLocation = gl.getUniformLocation(program, 'u_laggedMouse');

    // Dynamic uniform locations from param names
    const dynamicUniformLocations: Record<string, WebGLUniformLocation | null> = {};
    for (const name of uniformNames) {
      dynamicUniformLocations[name] = gl.getUniformLocation(program, 'u_' + name);
    }

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

    const startTime = performance.now();

    const render = () => {
      if (!textureLoaded) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const p = paramsRef.current ?? defaults;
      const lagFactor = p.lagFactor ?? defaults.lagFactor;
      const mouseActivationEasing = p.mouseActivationEasing ?? defaults.mouseActivationEasing;

      laggedMouseRef.current.x +=
        (mouseRef.current.x - laggedMouseRef.current.x) * lagFactor;
      laggedMouseRef.current.y +=
        (mouseRef.current.y - laggedMouseRef.current.y) * lagFactor;

      const targetActivation = mouseActiveRef.current;
      mouseActivationRef.current +=
        (targetActivation - mouseActivationRef.current) * mouseActivationEasing;

      velocityRef.current.x =
        (mouseRef.current.x - laggedMouseRef.current.x) / Math.max(dt, 0.001);
      velocityRef.current.y =
        (mouseRef.current.y - laggedMouseRef.current.y) / Math.max(dt, 0.001);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Set built-in uniforms
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

      // Set all dynamic uniforms from params
      for (const name of uniformNames) {
        const loc = dynamicUniformLocations[name];
        if (loc !== null) {
          gl.uniform1f(loc, p[name] ?? defaults[name] ?? 0);
        }
      }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, width, height, dprMultiplier, vertexShaderSource, fragmentShaderSource]);

  if (!webglSupported) {
    return (
      <Image
        src={imageSrc}
        alt="Shader preview"
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
