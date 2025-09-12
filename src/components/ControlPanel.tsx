'use client';

import { DeskDimensions, DIMENSION_LIMITS, DEFAULT_DIMENSIONS } from '@/types';

interface ControlPanelProps {
  dimensions: DeskDimensions;
  onDimensionChange: (dimensions: DeskDimensions) => void;
}

export default function ControlPanel({ dimensions, onDimensionChange }: ControlPanelProps) {
  const handleSliderChange = (key: keyof DeskDimensions, value: number) => {
    onDimensionChange({
      ...dimensions,
      [key]: value
    });
  };

  const resetToDefault = () => {
    onDimensionChange(DEFAULT_DIMENSIONS);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', width: '300px' }}>
      <h3>책상 치수 조정</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          폭 (Width): {dimensions.width}cm
          <br />
          <input
            type="range"
            min={DIMENSION_LIMITS.width.min}
            max={DIMENSION_LIMITS.width.max}
            value={dimensions.width}
            onChange={(e) => handleSliderChange('width', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          깊이 (Depth): {dimensions.depth}cm
          <br />
          <input
            type="range"
            min={DIMENSION_LIMITS.depth.min}
            max={DIMENSION_LIMITS.depth.max}
            value={dimensions.depth}
            onChange={(e) => handleSliderChange('depth', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          높이 (Height): {dimensions.height}cm
          <br />
          <input
            type="range"
            min={DIMENSION_LIMITS.height.min}
            max={DIMENSION_LIMITS.height.max}
            value={dimensions.height}
            onChange={(e) => handleSliderChange('height', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <button onClick={resetToDefault} style={{ padding: '10px 20px' }}>
        기본값으로 리셋
      </button>
    </div>
  );
}