'use client';

import { useEffect, useRef, useMemo } from 'react';
import { generateTopViewDXF } from '@/utils/dxfGenerator';
import { parseDxfContentSimple, DxfEntity } from '@/utils/simpleDxfParser';
import { downloadDxfFile } from '@/utils/dxfDownloader';
import { DeskDimensions } from '@/types';

interface DxfViewerProps {
  dimensions: DeskDimensions;
}

export default function DxfViewer({ dimensions }: DxfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // DXF 생성 후 파싱
  const entities = useMemo(() => {
    const dxfContent = generateTopViewDXF(dimensions);
    return parseDxfContentSimple(dxfContent, dimensions);
  }, [dimensions]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 좌표계 설정 (중앙이 원점, CAD 방식)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(2, -2); // Y축 뒤집기 및 확대

    // DXF 엔티티 렌더링
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;

    entities.forEach((entity: DxfEntity) => {
      if (entity.type === 'LINE') {
        ctx.beginPath();
        ctx.moveTo(entity.start.x, entity.start.y);
        ctx.lineTo(entity.end.x, entity.end.y);
        ctx.stroke();
      } else if (entity.type === 'CIRCLE') {
        ctx.beginPath();
        ctx.arc(entity.center.x, entity.center.y, entity.radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [entities]);

  const handleDownload = () => {
    const fileName = `desk-${dimensions.width}x${dimensions.depth}x${dimensions.height}.dxf`;
    downloadDxfFile(dimensions, fileName);
  };

  return (
    <div style={{ border: '1px solid #ccc' }}>
      <h4 style={{ margin: '10px', textAlign: 'center' }}>
        Top View (DXF Entities: {entities.length})
      </h4>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ display: 'block', margin: '0 auto' }}
      />
      <div style={{ textAlign: 'center', margin: '10px' }}>
        <button 
          onClick={handleDownload}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          DXF 다운로드
        </button>
      </div>
    </div>
  );
}