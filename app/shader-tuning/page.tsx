import { Metadata } from 'next';
import ShaderTuningClient from './ShaderTuningClient';

export const metadata: Metadata = {
  title: 'Shader Tuning',
  robots: { index: false, follow: false },
};

export default function ShaderTuningPage() {
  return <ShaderTuningClient />;
}
