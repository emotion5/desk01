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
    <div style={{ width: '400px', height: '340px', border: '1px solid #ccc' }}>
      <h4 style={{ margin: '10px', textAlign: 'center' }}>
        3D View - {dimensions.width}×{dimensions.depth}×{dimensions.height}cm
      </h4>
      <div style={{ width: '100%', height: '260px' }}>
        <Canvas camera={{ position: [150, 100, 150], fov: 50 }}>
          {/* 조명 */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[100, 100, 50]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          
          {/* 3D 책상 모델 */}
          <DeskModel dimensions={dimensions} />
          
          {/* 카메라 컨트롤 */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={500}
          />
        </Canvas>
      </div>
      <div style={{ textAlign: 'center', margin: '10px' }}>
        <button 
          onClick={handleExportGLB}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          GLB 다운로드
        </button>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Blender, Unity, 3D 프린팅 지원
        </div>
      </div>
    </div>
  );
}