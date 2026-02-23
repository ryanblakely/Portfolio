// Bilateral filter: edge-preserving Gaussian smoothing
export const BILATERAL_FRAGMENT = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouseVelocity;
uniform float u_mouseActive;
uniform vec2 u_laggedMouse;

uniform float u_bilateralRadius;
uniform float u_bilateralSigmaSpace;
uniform float u_bilateralSigmaColor;

varying vec2 v_texCoord;

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec3 centerColor = texture2D(u_texture, v_texCoord).rgb;

  float sigmaSpace2 = 2.0 * u_bilateralSigmaSpace * u_bilateralSigmaSpace;
  float sigmaColor2 = 2.0 * u_bilateralSigmaColor * u_bilateralSigmaColor;

  vec3 totalColor = vec3(0.0);
  float totalWeight = 0.0;

  // Constant loop bounds for WebGL 1 compatibility
  for (int x = -8; x <= 8; x++) {
    for (int y = -8; y <= 8; y++) {
      float fx = float(x);
      float fy = float(y);

      // Skip pixels outside the current radius
      if (fx * fx + fy * fy > u_bilateralRadius * u_bilateralRadius) continue;

      vec2 offset = vec2(fx, fy) * texel;
      vec3 sampleColor = texture2D(u_texture, v_texCoord + offset).rgb;

      // Spatial weight
      float spatialDist2 = fx * fx + fy * fy;
      float spatialWeight = exp(-spatialDist2 / sigmaSpace2);

      // Color distance weight
      vec3 colorDiff = sampleColor - centerColor;
      float colorDist2 = dot(colorDiff, colorDiff);
      float colorWeight = exp(-colorDist2 / sigmaColor2);

      float weight = spatialWeight * colorWeight;
      totalColor += sampleColor * weight;
      totalWeight += weight;
    }
  }

  vec3 result = totalColor / totalWeight;
  float alpha = texture2D(u_texture, v_texCoord).a;

  gl_FragColor = vec4(result, alpha);
}
`;
