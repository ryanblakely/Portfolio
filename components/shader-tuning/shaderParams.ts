export type EffectType = 'halftone' | 'cartoon' | 'bilateral' | 'kuwahara';

export interface ShaderParam {
  value: number;
  min: number;
  max: number;
  step: number;
  group: string;
  label: string;
  type?: 'float' | 'color' | 'int';
}

export type ShaderParams = Record<string, ShaderParam>;

export interface ShaderParamDef extends ShaderParam {
  name: string;
  effect: EffectType;
}

// Shared params used across all effects (vertex displacement + canvas/JS)
const SHARED_PARAMS: Omit<ShaderParamDef, 'effect'>[] = [
  // Vertex Displacement
  { name: 'dispRadius', value: 1.0, min: 0, max: 3, step: 0.1, group: 'Vertex Displacement', label: 'Displacement Radius' },
  { name: 'dispStrength', value: 0.03, min: 0, max: 0.2, step: 0.001, group: 'Vertex Displacement', label: 'Displacement Strength' },
  { name: 'timeVarAmp', value: 0.1, min: 0, max: 1, step: 0.01, group: 'Vertex Displacement', label: 'Time Variation Amp' },
  { name: 'timeVarFreq', value: 3.0, min: 0, max: 20, step: 0.1, group: 'Vertex Displacement', label: 'Time Variation Freq' },

  // Canvas / JS
  { name: 'dprMultiplier', value: 2, min: 0.5, max: 4, step: 0.5, group: 'Canvas / JS', label: 'DPR Multiplier' },
  { name: 'lagFactor', value: 0.15, min: 0.01, max: 1, step: 0.01, group: 'Canvas / JS', label: 'Lag Factor' },
  { name: 'mouseActivationEasing', value: 0.1, min: 0.01, max: 1, step: 0.01, group: 'Canvas / JS', label: 'Mouse Activation Easing' },
];

export const PARAM_DEFS: ShaderParamDef[] = [
  // ── Halftone ──
  // Dot Grid
  { name: 'dotSize', value: 4.4, min: 0.5, max: 10, step: 0.1, group: 'Dot Grid', label: 'Dot Size', effect: 'halftone' },
  { name: 'spacing', value: 8.4, min: 1, max: 15, step: 0.1, group: 'Dot Grid', label: 'Spacing', effect: 'halftone' },
  { name: 'dotColorR', value: 0, min: 0, max: 1, step: 0.01, group: 'Dot Grid', label: 'Dot Color R', type: 'color', effect: 'halftone' },
  { name: 'dotColorG', value: 0, min: 0, max: 1, step: 0.01, group: 'Dot Grid', label: 'Dot Color G', type: 'color', effect: 'halftone' },
  { name: 'dotColorB', value: 0, min: 0, max: 1, step: 0.01, group: 'Dot Grid', label: 'Dot Color B', type: 'color', effect: 'halftone' },
  { name: 'dotColorA', value: 0.47, min: 0, max: 1, step: 0.01, group: 'Dot Grid', label: 'Dot Color A', type: 'color', effect: 'halftone' },

  // Brightness Mapping
  { name: 'smoothstepLow', value: 0.0, min: 0, max: 1, step: 0.01, group: 'Brightness Mapping', label: 'Smoothstep Low', effect: 'halftone' },
  { name: 'smoothstepHigh', value: 1.06, min: 0, max: 2, step: 0.01, group: 'Brightness Mapping', label: 'Smoothstep High', effect: 'halftone' },

  // Edge Fade
  { name: 'fadeZoneMultiplier', value: 0.2, min: 0, max: 1, step: 0.01, group: 'Edge Fade', label: 'Fade Zone Multiplier', effect: 'halftone' },
  { name: 'showProbScale', value: 0.8, min: 0, max: 1, step: 0.01, group: 'Edge Fade', label: 'Show Prob Scale', effect: 'halftone' },
  { name: 'showProbBase', value: 0.2, min: 0, max: 1, step: 0.01, group: 'Edge Fade', label: 'Show Prob Base', effect: 'halftone' },

  // Mouse Interaction
  { name: 'baseRadius', value: 470, min: 0, max: 1000, step: 10, group: 'Mouse Interaction', label: 'Base Radius', effect: 'halftone' },
  { name: 'velocityRadiusMult', value: 20, min: 0, max: 100, step: 1, group: 'Mouse Interaction', label: 'Velocity Radius Mult', effect: 'halftone' },
  { name: 'mouseInfluenceMax', value: 0.75, min: 0, max: 2, step: 0.01, group: 'Mouse Interaction', label: 'Mouse Influence Max', effect: 'halftone' },
  { name: 'hideProb', value: 0.8, min: 0, max: 1, step: 0.01, group: 'Mouse Interaction', label: 'Hide Probability', effect: 'halftone' },

  // Recovery Animation
  { name: 'recoveryTimeBase', value: 0.1, min: 0.01, max: 2, step: 0.01, group: 'Recovery Animation', label: 'Recovery Time Base', effect: 'halftone' },
  { name: 'recoveryTimeRange', value: 1.0, min: 0, max: 5, step: 0.1, group: 'Recovery Animation', label: 'Recovery Time Range', effect: 'halftone' },
  { name: 'recoveryWaveDamping', value: 0.7, min: 0, max: 1, step: 0.01, group: 'Recovery Animation', label: 'Recovery Wave Damping', effect: 'halftone' },

  // Fade Effect
  { name: 'baseFadeDuration', value: 0.5, min: 0, max: 3, step: 0.1, group: 'Fade Effect', label: 'Base Fade Duration', effect: 'halftone' },
  { name: 'fadeSpeedMult', value: 3.0, min: 0, max: 10, step: 0.1, group: 'Fade Effect', label: 'Fade Speed Mult', effect: 'halftone' },

  // Entrance Animation
  { name: 'sizeDelayMult', value: 1.5, min: 0, max: 5, step: 0.1, group: 'Entrance Animation', label: 'Size Delay Mult', effect: 'halftone' },
  { name: 'randomOffsetMult', value: 0.75, min: 0, max: 3, step: 0.1, group: 'Entrance Animation', label: 'Random Offset Mult', effect: 'halftone' },
  { name: 'animDuration', value: 0.1, min: 0.01, max: 2, step: 0.01, group: 'Entrance Animation', label: 'Animation Duration', effect: 'halftone' },

  // ── Cartoon (Posterize + Edges) ──
  { name: 'posterizeLevels', value: 6, min: 2, max: 20, step: 1, group: 'Posterize', label: 'Levels', type: 'int', effect: 'cartoon' },
  { name: 'posterizeStrength', value: 1.0, min: 0, max: 1, step: 0.01, group: 'Posterize', label: 'Strength', effect: 'cartoon' },
  { name: 'edgeThreshold', value: 0.15, min: 0, max: 1, step: 0.01, group: 'Edges', label: 'Threshold', effect: 'cartoon' },
  { name: 'edgeThickness', value: 1.5, min: 0.5, max: 5, step: 0.1, group: 'Edges', label: 'Thickness', effect: 'cartoon' },
  { name: 'edgeColorR', value: 0, min: 0, max: 1, step: 0.01, group: 'Edges', label: 'Edge Color R', type: 'color', effect: 'cartoon' },
  { name: 'edgeColorG', value: 0, min: 0, max: 1, step: 0.01, group: 'Edges', label: 'Edge Color G', type: 'color', effect: 'cartoon' },
  { name: 'edgeColorB', value: 0, min: 0, max: 1, step: 0.01, group: 'Edges', label: 'Edge Color B', type: 'color', effect: 'cartoon' },
  { name: 'saturationBoost', value: 1.4, min: 0.5, max: 3, step: 0.1, group: 'Color', label: 'Saturation Boost', effect: 'cartoon' },

  // ── Bilateral Filter ──
  { name: 'bilateralRadius', value: 4, min: 1, max: 8, step: 1, group: 'Bilateral', label: 'Radius', type: 'int', effect: 'bilateral' },
  { name: 'bilateralSigmaSpace', value: 3.0, min: 0.5, max: 10, step: 0.1, group: 'Bilateral', label: 'Sigma Space', effect: 'bilateral' },
  { name: 'bilateralSigmaColor', value: 0.15, min: 0.01, max: 1, step: 0.01, group: 'Bilateral', label: 'Sigma Color', effect: 'bilateral' },

  // ── Kuwahara Filter ──
  { name: 'kuwaharaRadius', value: 4, min: 1, max: 8, step: 1, group: 'Kuwahara', label: 'Radius', type: 'int', effect: 'kuwahara' },

  // ── Shared (all effects) ──
  ...SHARED_PARAMS.map(p => ({ ...p, effect: 'halftone' as EffectType })),
];

// Build a separate list of shared param names for lookup
const SHARED_PARAM_NAMES = new Set(SHARED_PARAMS.map(p => p.name));

export function getDefaults(effect?: EffectType): Record<string, number> {
  const defaults: Record<string, number> = {};
  for (const param of PARAM_DEFS) {
    if (!effect || param.effect === effect || SHARED_PARAM_NAMES.has(param.name)) {
      defaults[param.name] = param.value;
    }
  }
  return defaults;
}

export function getParamDefs(effect: EffectType): ShaderParamDef[] {
  return PARAM_DEFS.filter(
    p => p.effect === effect || SHARED_PARAM_NAMES.has(p.name),
  );
}

export function getUniformNames(effect: EffectType): string[] {
  return getParamDefs(effect)
    .filter(p => p.group !== 'Canvas / JS')
    .map(p => p.name);
}
