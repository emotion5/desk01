'use client';

import { DeskDimensions, DIMENSION_LIMITS, DEFAULT_DIMENSIONS } from '@/types';

interface ControlPanelProps {
  dimensions: DeskDimensions;
  onDimensionChange: (dimensions: DeskDimensions) => void;
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

function SliderControl({ label, value, min, max, unit, onChange }: SliderControlProps) {
  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'baseline',
        marginBottom: 'var(--spacing-sm)'
      }}>
        <label className="body-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </label>
        <span style={{ 
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: '18px',
          color: 'var(--color-text-primary)'
        }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="apple-slider"
        style={{ marginBottom: 'var(--spacing-xs)' }}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '13px',
        color: 'var(--color-text-secondary)'
      }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
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
    <div style={{
      padding: 'var(--spacing-xl)',
      background: 'var(--color-surface-elevated)',
      border: '1px solid var(--color-border)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 className="title-medium" style={{ marginBottom: 'var(--spacing-lg)' }}>
        Customize Your Desk
      </h2>
      
      <SliderControl
        label="Width"
        value={dimensions.width}
        min={DIMENSION_LIMITS.width.min}
        max={DIMENSION_LIMITS.width.max}
        unit="cm"
        onChange={(value) => handleSliderChange('width', value)}
      />

      <SliderControl
        label="Depth"
        value={dimensions.depth}
        min={DIMENSION_LIMITS.depth.min}
        max={DIMENSION_LIMITS.depth.max}
        unit="cm"
        onChange={(value) => handleSliderChange('depth', value)}
      />

      <SliderControl
        label="Height"
        value={dimensions.height}
        min={DIMENSION_LIMITS.height.min}
        max={DIMENSION_LIMITS.height.max}
        unit="cm"
        onChange={(value) => handleSliderChange('height', value)}
      />

      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={resetToDefault}
          className="btn-secondary"
          style={{ width: '100%', marginTop: 'var(--spacing-md)', borderRadius: '0' }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}