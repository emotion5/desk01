import { generateTopViewDXF } from './dxfGenerator';
import { DeskDimensions } from '@/types';

export function downloadDxfFile(dimensions: DeskDimensions, fileName: string = 'desk-top-view.dxf') {
  try {
    // DXF 내용 생성
    const dxfContent = generateTopViewDXF(dimensions);
    
    // 디버깅: DXF 내용 확인
    console.log('=== DXF 다운로드 디버깅 ===');
    console.log('치수:', dimensions);
    console.log('DXF 길이:', dxfContent.length);
    console.log('LINE 개수:', (dxfContent.match(/LINE/g) || []).length);
    console.log('CIRCLE 개수:', (dxfContent.match(/CIRCLE/g) || []).length);
    console.log('DXF 일부 내용:', dxfContent.substring(0, 200) + '...');
    
    // Blob 생성
    const blob = new Blob([dxfContent], { 
      type: 'application/octet-stream' 
    });
    
    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL 정리
    URL.revokeObjectURL(url);
    
    console.log(`DXF file downloaded: ${fileName}`);
  } catch (error) {
    console.error('DXF download failed:', error);
    throw error;
  }
}