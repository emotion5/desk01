'use client';

import { useState } from 'react';
import { DeskDimensions, DEFAULT_DIMENSIONS } from '@/types';
import ControlPanel from './ControlPanel';
import ThreeDViewer from './ThreeDViewer';

export default function DeskBuilder() {
  const [dimensions, setDimensions] = useState<DeskDimensions>(DEFAULT_DIMENSIONS);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--spacing-2xl)',
      alignItems: 'stretch',
      minHeight: '600px'
    }}>
      <ThreeDViewer dimensions={dimensions} />
      <ControlPanel
        dimensions={dimensions}
        onDimensionChange={setDimensions}
      />
    </div>
  );
}