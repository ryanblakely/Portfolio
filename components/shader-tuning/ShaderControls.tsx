'use client';

import { useState, useCallback, useMemo } from 'react';
import { getDefaults, getParamDefs } from './shaderParams';
import type { ShaderParamDef, EffectType } from './shaderParams';
import styles from './ShaderControls.module.css';

const EFFECTS: { id: EffectType; label: string }[] = [
  { id: 'halftone', label: 'Halftone' },
  { id: 'cartoon', label: 'Cartoon' },
  { id: 'bilateral', label: 'Bilateral' },
  { id: 'kuwahara', label: 'Kuwahara' },
];

interface ShaderControlsProps {
  paramsRef: React.RefObject<Record<string, number>>;
  onReset: () => void;
  activeEffect: EffectType;
  onEffectChange: (effect: EffectType) => void;
}

function floatToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToFloats(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

// Detect color groups: finds RGB param sets sharing a prefix (e.g., "dotColor" → R, G, B)
function findColorGroups(defs: ShaderParamDef[]): Map<string, { r: string; g: string; b: string; label: string }> {
  const colorParams = defs.filter(d => d.type === 'color');
  const prefixes = new Map<string, { r: string; g: string; b: string; label: string }>();

  for (const param of colorParams) {
    // Match names like "dotColorR", "edgeColorG" etc.
    const match = param.name.match(/^(.+)(R|G|B)$/);
    if (!match) continue;
    const prefix = match[1];
    if (!prefixes.has(prefix)) {
      prefixes.set(prefix, { r: '', g: '', b: '', label: '' });
    }
    const entry = prefixes.get(prefix)!;
    const channel = match[2];
    if (channel === 'R') { entry.r = param.name; entry.label = param.label.replace(/ R$/, ''); }
    if (channel === 'G') entry.g = param.name;
    if (channel === 'B') entry.b = param.name;
  }

  // Only keep complete RGB sets
  for (const [key, val] of prefixes) {
    if (!val.r || !val.g || !val.b) prefixes.delete(key);
  }

  return prefixes;
}

export default function ShaderControls({ paramsRef, onReset, activeEffect, onEffectChange }: ShaderControlsProps) {
  const [display, setDisplay] = useState<Record<string, number>>(() => ({
    ...getDefaults(),
    ...paramsRef.current,
  }));

  const filteredDefs = useMemo(() => getParamDefs(activeEffect), [activeEffect]);

  const groups = useMemo(() => {
    const map = new Map<string, ShaderParamDef[]>();
    for (const def of filteredDefs) {
      const list = map.get(def.group) || [];
      list.push(def);
      map.set(def.group, list);
    }
    return map;
  }, [filteredDefs]);

  const colorGroups = useMemo(() => findColorGroups(filteredDefs), [filteredDefs]);

  const updateParam = useCallback(
    (name: string, value: number) => {
      if (paramsRef.current) {
        paramsRef.current[name] = value;
      }
      setDisplay((prev) => ({ ...prev, [name]: value }));
    },
    [paramsRef],
  );

  const handleReset = useCallback(() => {
    onReset();
    setDisplay(getDefaults());
  }, [onReset]);

  const handleCopy = useCallback(() => {
    const lines: string[] = [];
    for (const [group, defs] of groups) {
      lines.push(`// ${group}`);
      for (const def of defs) {
        const val = display[def.name] ?? def.value;
        lines.push(`${def.name}: ${val}`);
      }
      lines.push('');
    }
    navigator.clipboard.writeText(lines.join('\n').trim());
  }, [groups, display]);

  const handleColorChange = useCallback(
    (prefix: string, hex: string) => {
      const group = colorGroups.get(prefix);
      if (!group) return;
      const [r, g, b] = hexToFloats(hex);
      updateParam(group.r, parseFloat(r.toFixed(3)));
      updateParam(group.g, parseFloat(g.toFixed(3)));
      updateParam(group.b, parseFloat(b.toFixed(3)));
    },
    [updateParam, colorGroups],
  );

  return (
    <div className={styles.panel}>
      <div className={styles.effectTabs}>
        {EFFECTS.map((fx) => (
          <button
            key={fx.id}
            className={`${styles.effectTab} ${activeEffect === fx.id ? styles.effectTabActive : ''}`}
            onClick={() => onEffectChange(fx.id)}
          >
            {fx.label}
          </button>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset All
        </button>
        <button className={styles.copyBtn} onClick={handleCopy}>
          Copy Values
        </button>
      </div>

      {Array.from(groups.entries()).map(([group, defs]) => {
        // Find color groups that belong to this param group
        const groupColorPrefixes = Array.from(colorGroups.entries()).filter(
          ([, cg]) => defs.some(d => d.name === cg.r),
        );

        return (
          <details key={group} className={styles.group} open>
            <summary>{group}</summary>
            <div className={styles.groupContent}>
              {groupColorPrefixes.map(([prefix, cg]) => (
                <div key={prefix} className={styles.colorRow}>
                  <span className={styles.colorLabel}>{cg.label}</span>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={floatToHex(
                      display[cg.r] ?? 0,
                      display[cg.g] ?? 0,
                      display[cg.b] ?? 0,
                    )}
                    onChange={(e) => handleColorChange(prefix, e.target.value)}
                  />
                </div>
              ))}

              {defs.map((def) => (
                <div key={def.name} className={styles.row}>
                  <span className={styles.label}>{def.label}</span>
                  <input
                    type="range"
                    className={styles.range}
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    value={display[def.name] ?? def.value}
                    onChange={(e) =>
                      updateParam(def.name, parseFloat(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    className={styles.number}
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    value={display[def.name] ?? def.value}
                    onChange={(e) =>
                      updateParam(def.name, parseFloat(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
