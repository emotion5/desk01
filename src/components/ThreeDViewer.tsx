'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Edges, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { DeskDimensions } from '@/types';
import { exportToGLB } from '@/utils/glbExporter';

interface ThreeDViewerProps {
  dimensions: DeskDimensions;
}

function AxisHelper() {
  const axisLength = 50;

  return (
    <group>
      {/* X축 - 빨강 */}
      <Box args={[axisLength, 0.5, 0.5]} position={[axisLength/2, 0, 0]}>
        <meshStandardMaterial color="#ff0000" />
      </Box>

      {/* Y축 - 초록 */}
      <Box args={[0.5, axisLength, 0.5]} position={[0, axisLength/2, 0]}>
        <meshStandardMaterial color="#00ff00" />
      </Box>

      {/* Z축 - 파랑 */}
      <Box args={[0.5, 0.5, axisLength]} position={[0, 0, axisLength/2]}>
        <meshStandardMaterial color="#0000ff" />
      </Box>
    </group>
  );
}

function DeskModel({ dimensions, viewMode }: { dimensions: DeskDimensions; viewMode: 'solid' | 'line' }) {
  const { width, depth, height } = dimensions;

  // 상판 설정
  const tableTopThickness = 2.5; // 2.5cm 두께 (기존의 절반)
  const legHeight = height - tableTopThickness; // 다리는 상판 아래까지만

  // 원점을 다리 높이 중심으로 설정
  const tableTopHeight = legHeight/2 + tableTopThickness/2; // 다리 위쪽 끝 + 상판 두께/2

  // 다리 설정
  const legRadius = 2.5; // 지름 5cm
  const legInset = 8; // 모서리에서 8cm 안쪽

  // 다리 위치 계산 (원점 기준으로 조정)
  const legPositions: [number, number, number][] = [
    [-(width/2 - legInset), 0, depth/2 - legInset],   // 좌상단 (Y=0이 다리 중심)
    [width/2 - legInset, 0, depth/2 - legInset],     // 우상단
    [width/2 - legInset, 0, -(depth/2 - legInset)],  // 우하단
    [-(width/2 - legInset), 0, -(depth/2 - legInset)] // 좌하단
  ];

  return (
    <group>
      {/* 좌표축 */}
      <AxisHelper />

      {/* 상판 */}
      <Box
        args={[width, tableTopThickness, depth]}
        position={[0, tableTopHeight, 0]}
      >
        {viewMode === 'solid' ? (
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.0}
          />
        ) : (
          <>
            <meshBasicMaterial transparent opacity={0} />
            <Edges>
              <lineBasicMaterial color="#333333" />
            </Edges>
          </>
        )}
      </Box>

      {/* 4개 다리 */}
      {legPositions.map((position, index) => (
        <Cylinder
          key={index}
          args={[legRadius, legRadius, legHeight, 16]}
          position={position}
        >
          {viewMode === 'solid' ? (
            <meshStandardMaterial
              color="#c0c0c0"
              metalness={0.8}
              roughness={0.1}
            />
          ) : (
            <>
              <meshBasicMaterial transparent opacity={0} />
              <Edges>
                <lineBasicMaterial color="#333333" />
              </Edges>
            </>
          )}
        </Cylinder>
      ))}
    </group>
  );
}

export default function ThreeDViewer({ dimensions }: ThreeDViewerProps) {
  const [viewMode, setViewMode] = useState<'solid' | 'line'>('solid');

  const handleExportGLB = async () => {
    try {
      await exportToGLB(dimensions);
    } catch (error) {
      alert('GLB 내보내기에 실패했습니다: ' + (error as Error).message);
    }
  };

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{
        padding: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-elevated)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 className="title-medium" style={{ marginBottom: 'var(--spacing-xs)' }}>
            3D Preview
          </h3>
          <p className="caption">
            {dimensions.width} × {dimensions.depth} × {dimensions.height} cm
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          <button
            onClick={() => setViewMode('solid')}
            className={viewMode === 'solid' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Solid
          </button>
          <button
            onClick={() => setViewMode('line')}
            className={viewMode === 'line' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Line
          </button>
        </div>
      </div>
      
      <div style={{
        width: '100%',
        flex: 1,
        background: '#606060',
        position: 'relative'
      }}>
        <Canvas 
          camera={{ position: [150, 100, 150], fov: 50 }}
        >
          {/* 실내 저녁 환경광 */}
          <Environment preset="apartment" />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[50, 80, 30]}
            intensity={0.6}
            color="#ffd4a3"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[30, 40, 30]} intensity={0.4} color="#ffb366" />
          <pointLight position={[-30, 40, -30]} intensity={0.3} color="#ffd4a3" />
          
          {/* 3D 책상 모델 */}
          <DeskModel dimensions={dimensions} viewMode={viewMode} />
          
          {/* 카메라 컨트롤 */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={150}
            enableDamping={true}
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={5 * Math.PI / 6}
          />
        </Canvas>
      </div>
    </div>
  );
}