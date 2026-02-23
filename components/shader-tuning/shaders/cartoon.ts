// Shared vertex shader with mouse displacement for fullscreen quad effects
export const PASSTHROUGH_VERTEX = `
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

// Posterize + Sobel edge detection cartoon shader
export const CARTOON_FRAGMENT = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouseVelocity;
uniform float u_mouseActive;
uniform vec2 u_laggedMouse;

uniform float u_posterizeLevels;
uniform float u_posterizeStrength;
uniform float u_edgeThreshold;
uniform float u_edgeThickness;
uniform float u_edgeColorR;
uniform float u_edgeColorG;
uniform float u_edgeColorB;
uniform float u_saturationBoost;

varying vec2 v_texCoord;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 texel = u_edgeThickness / u_resolution;

  // Sample 3x3 neighborhood for Sobel
  float tl = luminance(texture2D(u_texture, v_texCoord + vec2(-texel.x, -texel.y)).rgb);
  float tc = luminance(texture2D(u_texture, v_texCoord + vec2(0.0, -texel.y)).rgb);
  float tr = luminance(texture2D(u_texture, v_texCoord + vec2(texel.x, -texel.y)).rgb);
  float ml = luminance(texture2D(u_texture, v_texCoord + vec2(-texel.x, 0.0)).rgb);
  float mr = luminance(texture2D(u_texture, v_texCoord + vec2(texel.x, 0.0)).rgb);
  float bl = luminance(texture2D(u_texture, v_texCoord + vec2(-texel.x, texel.y)).rgb);
  float bc = luminance(texture2D(u_texture, v_texCoord + vec2(0.0, texel.y)).rgb);
  float br = luminance(texture2D(u_texture, v_texCoord + vec2(texel.x, texel.y)).rgb);

  // Sobel gradients
  float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;
  float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;
  float edge = length(vec2(gx, gy));

  // Edge mask
  float edgeMask = smoothstep(u_edgeThreshold, u_edgeThreshold + 0.1, edge);

  // Sample center color
  vec4 color = texture2D(u_texture, v_texCoord);

  // Posterize
  vec3 posterized = floor(color.rgb * u_posterizeLevels + 0.5) / u_posterizeLevels;
  vec3 base = mix(color.rgb, posterized, u_posterizeStrength);

  // Saturation boost
  vec3 hsv = rgb2hsv(base);
  hsv.y = min(hsv.y * u_saturationBoost, 1.0);
  base = hsv2rgb(hsv);

  // Blend with edge color
  vec3 edgeColor = vec3(u_edgeColorR, u_edgeColorG, u_edgeColorB);
  vec3 result = mix(base, edgeColor, edgeMask);

  gl_FragColor = vec4(result, color.a);
}
`;
