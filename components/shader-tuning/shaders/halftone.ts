export const HALFTONE_VERTEX = `
precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

uniform float u_mouseActive;
uniform float u_mouseActivation;
uniform vec2 u_laggedMouse;
uniform float u_time;

uniform float u_dispRadius;
uniform float u_dispStrength;
uniform float u_timeVarAmp;
uniform float u_timeVarFreq;

void main() {
  vec4 position = a_position;

  if (u_mouseActive > 0.5) {
    vec2 screenPos = position.xy;
    vec2 mouseScreenPos = vec2(
      (u_laggedMouse.x - 0.5) * 2.0,
      (0.5 - u_laggedMouse.y) * 2.0
    );

    float distanceToMouse = length(screenPos - mouseScreenPos);
    float displacementRadius = u_dispRadius;
    float displacementStrength = u_dispStrength;

    float influence = 0.5 / (1.0 + distanceToMouse * distanceToMouse * 2.0);
    float radiusFalloff = 1.0 - smoothstep(displacementRadius * 0.6, displacementRadius, distanceToMouse);

    float edgeDistanceX = min(abs(screenPos.x), 1.0 - abs(screenPos.x));
    float edgeDistanceY = min(abs(screenPos.y), 1.0 - abs(screenPos.y));
    float edgeDistance = min(edgeDistanceX, edgeDistanceY);

    float edgeFalloff = edgeDistance > 0.05 ? smoothstep(0.05, 0.2, edgeDistance) : 0.0;

    influence = influence * displacementStrength * radiusFalloff * edgeFalloff * u_mouseActivation;

    if (influence > 0.001) {
      vec2 pushDirection = distanceToMouse > 0.01 ? normalize(screenPos - mouseScreenPos) : vec2(0.0);
      float timeVariation = sin(u_time * u_timeVarFreq + distanceToMouse * 10.0) * u_timeVarAmp + 1.0;
      position.xy += pushDirection * influence * timeVariation;
    }
  }

  gl_Position = position;
  v_texCoord = a_texCoord;
}
`;

export const HALFTONE_FRAGMENT = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouseVelocity;
uniform float u_mouseActive;
uniform vec2 u_laggedMouse;

uniform float u_dotSize;
uniform float u_spacing;
uniform float u_dotColorR;
uniform float u_dotColorG;
uniform float u_dotColorB;
uniform float u_dotColorA;
uniform float u_smoothstepLow;
uniform float u_smoothstepHigh;
uniform float u_fadeZoneMultiplier;
uniform float u_showProbScale;
uniform float u_showProbBase;
uniform float u_baseRadius;
uniform float u_velocityRadiusMult;
uniform float u_mouseInfluenceMax;
uniform float u_hideProb;
uniform float u_recoveryTimeBase;
uniform float u_recoveryTimeRange;
uniform float u_recoveryWaveDamping;
uniform float u_baseFadeDuration;
uniform float u_fadeSpeedMult;
uniform float u_sizeDelayMult;
uniform float u_randomOffsetMult;
uniform float u_animDuration;

varying vec2 v_texCoord;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 83758.5453123);
}

void main() {
  vec2 pixelCoord = v_texCoord * u_resolution;
  vec2 mousePixel = u_laggedMouse * u_resolution;

  float dotSizePixels = u_dotSize;
  float spacingPixels = u_spacing;

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

  float baseDotSize = dotSizePixels * smoothstep(u_smoothstepLow, u_smoothstepHigh, (1.0 - brightness));

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
    float fadeZoneSize = random(gridCoord + vec2(123.45, 678.90)) * u_resolution.y * u_fadeZoneMultiplier;
    float edgeFactor = clamp(distFromEdge / fadeZoneSize, 0.0, 1.0);
    float edgeNoise = random(gridCoord);
    float showProbability = edgeFactor * u_showProbScale + u_showProbBase;

    vec2 dotCenter = originalGridPos + gridOffset;
    vec2 laggedMousePixel = u_laggedMouse * u_resolution;
    float mouseDistance = length(dotCenter - laggedMousePixel);

    float velocityMagnitude = length(u_mouseVelocity);
    float baseRadius = u_baseRadius;
    float velocityRadius = velocityMagnitude * u_velocityRadiusMult;
    float totalRadius = baseRadius + velocityRadius;

    float mouseInfluence = 0.0;
    if (mouseDistance < totalRadius && u_mouseActive > 0.5) {
      mouseInfluence = u_mouseInfluenceMax - (mouseDistance / totalRadius);
    }

    vec2 mouseHideCoord = floor((originalGridPos + gridOffset) / spacingPixels);
    float mouseHideNoise = random(mouseHideCoord + vec2(9.87, 6.54));

    float baseHideProbability = mouseInfluence * u_hideProb * u_mouseActive;
    float velocityBoost = min(velocityMagnitude * 2.0, 1.0);

    float impactSeed = random(mouseHideCoord + vec2(2.34, 7.89));
    float recoveryTime = u_recoveryTimeBase + impactSeed * u_recoveryTimeRange;
    float recoveryWave = sin(u_time / recoveryTime + impactSeed * 6.28) * 0.5 + 0.5;

    float hideProbability = baseHideProbability * (1.0 + velocityBoost) * (1.0 - recoveryWave * u_recoveryWaveDamping);

    if (edgeNoise > showProbability) {
      circle = 0.0;
    } else {
      float mouseFadeOut = 1.0;
      if (mouseHideNoise < 0.5) {
        float sizeFactor = adjustedDotSize / dotSizePixels;
        float baseFadeDuration = u_baseFadeDuration;
        float sizeFadeDuration = baseFadeDuration + sizeFactor * 1.0;

        float fadeSpeed = mouseInfluence * u_fadeSpeedMult;
        float fadeProgress = clamp(fadeSpeed - recoveryWave * 2.0, 0.0, 1.0);

        mouseFadeOut = 1.0 - smoothstep(0.0, sizeFadeDuration, fadeProgress * sizeFadeDuration);
      }

      circle *= mouseFadeOut;

      float sizeBasedDelay = (adjustedDotSize / dotSizePixels) * u_sizeDelayMult;
      float randomOffset = random(gridCoord + vec2(456.78, 901.23)) * u_randomOffsetMult;
      float animationDelay = sizeBasedDelay + randomOffset;
      float animationDuration = u_animDuration;
      float animationStart = animationDelay;
      float animationEnd = animationDelay + animationDuration;

      float fadeIn = smoothstep(animationStart, animationEnd, u_time);

      circle *= fadeIn;
    }
  }

  vec4 dotColor = vec4(u_dotColorR, u_dotColorG, u_dotColorB, u_dotColorA);
  vec4 finalColor = vec4(dotColor.rgb * circle, circle * dotColor.a);

  gl_FragColor = finalColor;
}
`;
