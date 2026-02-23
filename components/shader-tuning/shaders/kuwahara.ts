// Kuwahara filter: 4-quadrant mean/variance, pick lowest-variance quadrant
export const KUWAHARA_FRAGMENT = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouseVelocity;
uniform float u_mouseActive;
uniform vec2 u_laggedMouse;

uniform float u_kuwaharaRadius;

varying vec2 v_texCoord;

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  int radius = int(u_kuwaharaRadius);

  // Quadrant accumulators: mean and variance for each of 4 quadrants
  // Q0: top-left, Q1: top-right, Q2: bottom-left, Q3: bottom-right
  vec3 mean0 = vec3(0.0), mean1 = vec3(0.0), mean2 = vec3(0.0), mean3 = vec3(0.0);
  float var0 = 0.0, var1 = 0.0, var2 = 0.0, var3 = 0.0;
  float count0 = 0.0, count1 = 0.0, count2 = 0.0, count3 = 0.0;

  // First pass: accumulate means
  for (int x = -8; x <= 8; x++) {
    for (int y = -8; y <= 8; y++) {
      if (x > radius || x < -radius || y > radius || y < -radius) continue;

      vec2 offset = vec2(float(x), float(y)) * texel;
      vec3 sampleColor = texture2D(u_texture, v_texCoord + offset).rgb;

      // Assign to quadrants (overlap at center)
      if (x <= 0 && y <= 0) { mean0 += sampleColor; count0 += 1.0; }
      if (x >= 0 && y <= 0) { mean1 += sampleColor; count1 += 1.0; }
      if (x <= 0 && y >= 0) { mean2 += sampleColor; count2 += 1.0; }
      if (x >= 0 && y >= 0) { mean3 += sampleColor; count3 += 1.0; }
    }
  }

  mean0 /= max(count0, 1.0);
  mean1 /= max(count1, 1.0);
  mean2 /= max(count2, 1.0);
  mean3 /= max(count3, 1.0);

  // Second pass: accumulate variance
  for (int x = -8; x <= 8; x++) {
    for (int y = -8; y <= 8; y++) {
      if (x > radius || x < -radius || y > radius || y < -radius) continue;

      vec2 offset = vec2(float(x), float(y)) * texel;
      vec3 sampleColor = texture2D(u_texture, v_texCoord + offset).rgb;
      float lum = luminance(sampleColor);

      if (x <= 0 && y <= 0) { float d = lum - luminance(mean0); var0 += d * d; }
      if (x >= 0 && y <= 0) { float d = lum - luminance(mean1); var1 += d * d; }
      if (x <= 0 && y >= 0) { float d = lum - luminance(mean2); var2 += d * d; }
      if (x >= 0 && y >= 0) { float d = lum - luminance(mean3); var3 += d * d; }
    }
  }

  var0 /= max(count0, 1.0);
  var1 /= max(count1, 1.0);
  var2 /= max(count2, 1.0);
  var3 /= max(count3, 1.0);

  // Pick the quadrant with the lowest variance
  vec3 result = mean0;
  float minVar = var0;

  if (var1 < minVar) { result = mean1; minVar = var1; }
  if (var2 < minVar) { result = mean2; minVar = var2; }
  if (var3 < minVar) { result = mean3; }

  float alpha = texture2D(u_texture, v_texCoord).a;
  gl_FragColor = vec4(result, alpha);
}
`;
