import { DeskDimensions } from '@/types';

export interface ParsedLine {
  type: 'LINE';
  start: { x: number; y: number; z: number };
  end: { x: number; y: number; z: number };
}

export interface ParsedCircle {
  type: 'CIRCLE';
  center: { x: number; y: number; z: number };
  radius: number;
}

export type DxfEntity = ParsedLine | ParsedCircle;

// 임시로 치수에서 직접 엔티티 생성 (실제 DXF 구조와 동일)
export function generateEntitiesFromDimensions(dimensions: DeskDimensions): DxfEntity[] {
  const { width, depth } = dimensions;
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  
  const entities: DxfEntity[] = [];
  
  // 상판 테두리 - 4개의 LINE 엔티티
  entities.push(
    {
      type: 'LINE',
      start: { x: -halfWidth, y: -halfDepth, z: 0 },
      end: { x: halfWidth, y: -halfDepth, z: 0 }
    },
    {
      type: 'LINE', 
      start: { x: halfWidth, y: -halfDepth, z: 0 },
      end: { x: halfWidth, y: halfDepth, z: 0 }
    },
    {
      type: 'LINE',
      start: { x: halfWidth, y: halfDepth, z: 0 },
      end: { x: -halfWidth, y: halfDepth, z: 0 }
    },
    {
      type: 'LINE',
      start: { x: -halfWidth, y: halfDepth, z: 0 },
      end: { x: -halfWidth, y: -halfDepth, z: 0 }
    }
  );
  
  // 4개 다리 - CIRCLE 엔티티
  const legRadius = 2.5;
  const legInset = 5;
  
  const legPositions = [
    [-halfWidth + legInset, halfDepth - legInset],   // 좌상단
    [halfWidth - legInset, halfDepth - legInset],    // 우상단
    [halfWidth - legInset, -halfDepth + legInset],   // 우하단
    [-halfWidth + legInset, -halfDepth + legInset]   // 좌하단
  ];
  
  legPositions.forEach(([x, y]) => {
    entities.push({
      type: 'CIRCLE',
      center: { x, y, z: 0 },
      radius: legRadius
    });
  });
  
  return entities;
}

// DXF 파싱 대신 직접 엔티티 생성
export function parseDxfContentSimple(dxfContent: string, dimensions: DeskDimensions): DxfEntity[] {
  // 실제 DXF가 올바르게 생성되었는지 확인
  console.log('Generated DXF length:', dxfContent.length);
  console.log('DXF contains LINE:', dxfContent.includes('LINE'));
  console.log('DXF contains CIRCLE:', dxfContent.includes('CIRCLE'));
  
  // 치수에서 직접 엔티티 생성 (DXF와 동일한 구조)
  return generateEntitiesFromDimensions(dimensions);
}