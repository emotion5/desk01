'use client';

import { useState } from 'react';
import { DeskDimensions, DEFAULT_DIMENSIONS } from '@/types';
import ControlPanel from './ControlPanel';
import ThreeDViewer from './ThreeDViewer';

export default function DeskBuilder() {
  const [dimensions, setDimensions] = useState<DeskDimensions>(DEFAULT_DIMENSIONS);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <ControlPanel
        dimensions={dimensions}
        onDimensionChange={setDimensions}
      />
      <ThreeDViewer dimensions={dimensions} />
    </div>
  );
}