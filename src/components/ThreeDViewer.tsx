'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder } from '@react-three/drei';
import { DeskDimensions } from '@/types';
import { exportToGLB } from '@/utils/glbExporter';

interface ThreeDViewerProps {
  dimensions: DeskDimensions;
}

function DeskModel({ dimensions }: { dimensions: DeskDimensions }) {
  const { width, depth, height } = dimensions;
  
  // 상판 설정
  const tableTopThickness = 3; // 3cm 두께
  const tableTopHeight = height - 5; // 다리 위에서 5cm
  
  // 다리 설정
  const legRadius = 2.5; // 지름 5cm
  const legHeight = height - tableTopThickness;
  const legInset = 8; // 모서리에서 8cm 안쪽
  
  // 다리 위치 계산
  const legPositions: [number, number, number][] = [
    [-(width/2 - legInset), legHeight/2, depth/2 - legInset],   // 좌상단
    [width/2 - legInset, legHeight/2, depth/2 - legInset],     // 우상단  
    [width/2 - legInset, legHeight/2, -(depth/2 - legInset)],  // 우하단
    [-(width/2 - legInset), legHeight/2, -(depth/2 - legInset)] // 좌하단
  ];

  return (
    <group>
      {/* 상판 */}
      <Box 
        args={[width, tableTopThickness, depth]} 
        position={[0, tableTopHeight, 0]}
      >
        <meshStandardMaterial color="#8B4513" /> {/* 나무색 */}
      </Box>
      
      {/* 4개 다리 */}
      {legPositions.map((position, index) => (
        <Cylinder
          key={index}
          args={[legRadius, legRadius, legHeight, 16]}
          position={position}
        >
          <meshStandardMaterial color="#654321" /> {/* 어두운 나무색 */}
        </Cylinder>
      ))}
    </group>
  );
}

export default function ThreeDViewer({ dimensions }: ThreeDViewerProps) {
  const handleExportGLB = async () => {
    try {
      await exportToGLB(dimensions);
    } catch (error) {
      alert('GLB 내보내기에 실패했습니다: ' + (error as Error).message);
    }
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-elevated)'
      }}>
        <h3 className="title-medium" style={{ marginBottom: 'var(--spacing-xs)' }}>
          3D Preview
        </h3>
        <p className="caption">
          {dimensions.width} × {dimensions.depth} × {dimensions.height} cm
        </p>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '400px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
      }}>
        <Canvas 
          camera={{ position: [150, 100, 150], fov: 50 }}
        >
          {/* 더 부드러운 조명 */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[100, 100, 50]} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-50, 50, 50]} intensity={0.3} />
          
          {/* 3D 책상 모델 */}
          <DeskModel dimensions={dimensions} />
          
          {/* 카메라 컨트롤 */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={500}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
      
      <div style={{ 
        padding: 'var(--spacing-lg)',
        background: 'var(--color-surface-elevated)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <button 
          onClick={handleExportGLB}
          className="btn-primary"
          style={{ width: '100%', marginBottom: 'var(--spacing-sm)' }}
        >
          Export as GLB
        </button>
        <p className="caption" style={{ textAlign: 'center' }}>
          Compatible with Blender, Unity, and 3D printing
        </p>
      </div>
    </div>
  );
}