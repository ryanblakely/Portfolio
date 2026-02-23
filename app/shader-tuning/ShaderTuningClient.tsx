'use client';

import { useRef, useState, useCallback } from 'react';
import { TunableShaderCanvas } from '../../components/shader-tuning/TunableShaderCanvas';
import ShaderControls from '../../components/shader-tuning/ShaderControls';
import { getDefaults, getUniformNames } from '../../components/shader-tuning/shaderParams';
import type { EffectType } from '../../components/shader-tuning/shaderParams';
import { HALFTONE_VERTEX, HALFTONE_FRAGMENT } from '../../components/shader-tuning/shaders/halftone';
import { PASSTHROUGH_VERTEX, CARTOON_FRAGMENT } from '../../components/shader-tuning/shaders/cartoon';
import { BILATERAL_FRAGMENT } from '../../components/shader-tuning/shaders/bilateral';
import { KUWAHARA_FRAGMENT } from '../../components/shader-tuning/shaders/kuwahara';
import styles from './page.module.css';

const DEFAULT_IMAGE = '/avatar-halftone.jpg';

const EFFECT_SHADERS: Record<EffectType, { vertex: string; fragment: string }> = {
  halftone: { vertex: HALFTONE_VERTEX, fragment: HALFTONE_FRAGMENT },
  cartoon: { vertex: PASSTHROUGH_VERTEX, fragment: CARTOON_FRAGMENT },
  bilateral: { vertex: PASSTHROUGH_VERTEX, fragment: BILATERAL_FRAGMENT },
  kuwahara: { vertex: PASSTHROUGH_VERTEX, fragment: KUWAHARA_FRAGMENT },
};

export default function ShaderTuningClient() {
  const paramsRef = useRef(getDefaults());
  const [resetKey, setResetKey] = useState(0);
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);
  const [activeEffect, setActiveEffect] = useState<EffectType>('halftone');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;
    setImageSrc(url);
  }, []);

  const handleResetImage = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setImageSrc(DEFAULT_IMAGE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleReset = () => {
    paramsRef.current = getDefaults();
    setResetKey((k) => k + 1);
    handleResetImage();
  };

  const handleEffectChange = useCallback((effect: EffectType) => {
    // Preserve shared params (vertex displacement, canvas/JS) across effect switches
    const shared: Record<string, number> = {};
    const sharedKeys = ['dispRadius', 'dispStrength', 'timeVarAmp', 'timeVarFreq', 'dprMultiplier', 'lagFactor', 'mouseActivationEasing'];
    for (const key of sharedKeys) {
      if (paramsRef.current[key] !== undefined) {
        shared[key] = paramsRef.current[key];
      }
    }
    paramsRef.current = { ...getDefaults(effect), ...shared };
    setActiveEffect(effect);
    setResetKey((k) => k + 1);
  }, []);

  const shaders = EFFECT_SHADERS[activeEffect];
  const uniformNames = getUniformNames(activeEffect);

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <div className={styles.imageControls}>
          <button
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Image
          </button>
          {imageSrc !== DEFAULT_IMAGE && (
            <button className={styles.resetImageBtn} onClick={handleResetImage}>
              Reset Image
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>
        <TunableShaderCanvas
          key={`${activeEffect}-${resetKey}`}
          imageSrc={imageSrc}
          width={300}
          height={300}
          paramsRef={paramsRef}
          vertexShader={shaders.vertex}
          fragmentShader={shaders.fragment}
          uniformNames={uniformNames}
        />
      </div>
      <div className={styles.controls} key={`controls-${resetKey}`}>
        <ShaderControls
          paramsRef={paramsRef}
          onReset={handleReset}
          activeEffect={activeEffect}
          onEffectChange={handleEffectChange}
        />
      </div>
    </div>
  );
}
