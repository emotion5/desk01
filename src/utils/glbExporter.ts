import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { DeskDimensions } from '@/types';

// 3D 책상 모델 생성 함수
function createDeskGeometry(dimensions: DeskDimensions): THREE.Group {
  const { width, depth, height } = dimensions;
  const group = new THREE.Group();
  
  // 재질 설정
  const tableMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513, // 나무색
    roughness: 0.8,
    metalness: 0.1
  });
  
  const legMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x654321, // 어두운 나무색
    roughness: 0.9,
    metalness: 0.05
  });
  
  // 상판 생성
  const tableTopThickness = 3;
  const tableTopGeometry = new THREE.BoxGeometry(width, tableTopThickness, depth);
  const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
  tableTop.position.y = height - tableTopThickness/2;
  tableTop.name = 'TableTop';
  group.add(tableTop);
  
  // 다리 생성
  const legRadius = 2.5;
  const legHeight = height - tableTopThickness;
  const legInset = 8;
  const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
  
  const legPositions = [
    [-(width/2 - legInset), legHeight/2, depth/2 - legInset],   // 좌상단
    [width/2 - legInset, legHeight/2, depth/2 - legInset],     // 우상단  
    [width/2 - legInset, legHeight/2, -(depth/2 - legInset)],  // 우하단
    [-(width/2 - legInset), legHeight/2, -(depth/2 - legInset)] // 좌하단
  ];
  
  legPositions.forEach((position, index) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(position[0], position[1], position[2]);
    leg.name = `Leg${index + 1}`;
    group.add(leg);
  });
  
  group.name = `Desk_${width}x${depth}x${height}`;
  return group;
}

// GLB 파일로 내보내기
export async function exportToGLB(dimensions: DeskDimensions, filename?: string): Promise<void> {
  try {
    // 3D 모델 생성
    const deskModel = createDeskGeometry(dimensions);
    
    // GLTFExporter 인스턴스 생성
    const exporter = new GLTFExporter();
    
    // GLB로 내보내기 (바이너리 형태)
    const gltfData = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        deskModel,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(result);
          } else {
            reject(new Error('Expected ArrayBuffer but got JSON'));
          }
        },
        (error) => reject(error),
        { binary: true } // GLB 포맷으로 내보내기
      );
    });
    
    // Blob 생성 및 다운로드
    const blob = new Blob([gltfData], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `desk-${dimensions.width}x${dimensions.depth}x${dimensions.height}.glb`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log(`GLB file exported: ${link.download}`);
    
  } catch (error) {
    console.error('GLB export failed:', error);
    throw error;
  }
}