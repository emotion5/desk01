'use client';

import { useState } from 'react';
import { DeskDimensions, DEFAULT_DIMENSIONS } from '@/types';
import ControlPanel from './ControlPanel';
import ThreeDViewer from './ThreeDViewer';

export default function DeskBuilder() {
  const [dimensions, setDimensions] = useState<DeskDimensions>(DEFAULT_DIMENSIONS);

  return (
    <div className="grid-2col">
      <ThreeDViewer dimensions={dimensions} />
      <ControlPanel
        dimensions={dimensions}
        onDimensionChange={setDimensions}
      />
    </div>
  );
}