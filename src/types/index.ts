export interface DeskDimensions {
  width: number;   // 80-200cm
  depth: number;   // 40-100cm  
  height: number;  // 60-120cm
}

export const DEFAULT_DIMENSIONS: DeskDimensions = {
  width: 120,
  depth: 60,
  height: 75
};

export const DIMENSION_LIMITS = {
  width: { min: 80, max: 200 },
  depth: { min: 40, max: 100 },
  height: { min: 60, max: 120 }
};