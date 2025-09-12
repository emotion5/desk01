import { DxfWriter } from '@tarikjabiri/dxf';
import { DeskDimensions } from '@/types';

export function generateTopViewDXF(dimensions: DeskDimensions): string {
  const { width, depth } = dimensions;
  
  const writer = new DxfWriter();
  
  // 상판 (직사각형)
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  
  // 상판 테두리 - 사각형으로 구성
  // addRectangle(x, y, width, height) - 좌하단 기준
  writer.addRectangle(-halfWidth, -halfDepth, width, depth);
  
  // 4개 다리 (원형, 지름 5cm)
  const legRadius = 2.5;
  const legInset = 5; // 모서리에서 5cm 안쪽
  
  const legPositions = [
    [-halfWidth + legInset, halfDepth - legInset],   // 좌상단
    [halfWidth - legInset, halfDepth - legInset],    // 우상단
    [halfWidth - legInset, -halfDepth + legInset],   // 우하단
    [-halfWidth + legInset, -halfDepth + legInset]   // 좌하단
  ];
  
  // addCircle(x, y, z, radius)
  legPositions.forEach(([x, y]) => {
    writer.addCircle(x, y, 0, legRadius);
  });
  
  return writer.stringify();
}