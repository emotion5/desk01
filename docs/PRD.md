# 250909-desk - Desk Builder PRD (Product Requirements Document)

## 프로젝트 개요

### 프로젝트명
250909-desk - 3D 가구 모델링 빌더 웹 애플리케이션

### 목표
사용자가 폭(Width), 깊이(Depth), 높이(Height)를 조정하여 4개 다리를 가진 책상을 실시간 3D로 모델링하고 다양한 형태로 내보낼 수 있는 웹 기반 가구 컨피규레이터 제작

### 핵심 비전
- **실시간 3D 모델링**: 웹 브라우저에서 바로 3D 가구 확인
- **GLB/GLTF 내보내기**: Blender, Unity, 3D 프린팅에서 활용 가능
- **직관적인 3D 인터랙션**: 회전, 줌, 팬으로 모든 각도 확인

## 기술 스택

### Frontend Framework
- **Next.js 15** (App Router 방식)
- **TypeScript** (타입 안정성)
- **CSS Modules** (스타일과 로직 분리)

### 3D 모델링 & 렌더링
- **Three.js** - 웹 3D 렌더링 엔진
- **@react-three/fiber** - React용 Three.js 래퍼
- **@react-three/drei** - 3D 컴포넌트 라이브러리
- **GLTFExporter** - GLB/GLTF 파일 내보내기

### 개발 환경
- **ESLint** - 코드 품질 관리
- **Git** - 버전 관리

## 핵심 기능 명세

### 1. 치수 조정 인터페이스
#### 1.1 슬라이더 컨트롤
- **Width (폭)**: 80cm ~ 200cm (기본값: 120cm)
- **Depth (깊이)**: 40cm ~ 100cm (기본값: 60cm)
- **Height (높이)**: 60cm ~ 120cm (기본값: 75cm)
- 실시간 값 표시 및 업데이트
- "Reset to Default" 버튼

#### 1.2 입력 방식
- 드래그 슬라이더
- 숫자 직접 입력 (선택사항)
- 단위: cm 고정

### 2. 3D 뷰어 시스템
#### 2.1 실시간 3D 렌더링
1. **3D 모델 생성**
   - 상판: 직육면체 (BoxGeometry)
   - 다리 4개: 원기둥 (CylinderGeometry)
   - 실시간 기하학적 변환
   
2. **카메라 컨트롤**
   - 궤도 회전 (OrbitControls)
   - 줌 인/아웃
   - 팬(이동) 기능
   
3. **조명 시스템**
   - 환경광 (AmbientLight)
   - 방향광 (DirectionalLight)
   - 그림자 효과

#### 2.2 3D 뷰어 특징
- WebGL 기반 하드웨어 가속
- 60fps 부드러운 인터랙션
- 치수 변경 시 실시간 3D 모델 업데이트

### 3. GLB 내보내기 시스템
#### 3.1 3D 모델 구조
- **상판**: 실제 두께를 가진 직육면체
- **다리 4개**: 원기둥 형태 (지름 5cm)
- **재질**: PBR 표준 재질 (Metalness/Roughness)

#### 3.2 내보내기 기능
- **GLB 포맷**: 압축된 바이너리 GLTF
- **호환성**: Blender, Unity, UE5, 3D 프린팅
- **메타데이터**: 치수 정보 포함

## UI/UX 디자인

### 레이아웃 구조
```
┌─────────────────┬─────────────────────────────┐
│                 │        Desk Dimensions      │
│                 │                             │
│                 │   Width  [====o===] 120cm  │
│   3D Viewer     │   Depth  [===o====] 60cm   │
│  (Interactive)  │   Height [===o====] 75cm   │
│                 │                             │
│  🔄 회전 가능   │   [Reset to Default]        │
│  🔍 줌 인/아웃  │   [Download GLB]            │
│                 │                             │
└─────────────────┴─────────────────────────────┘
```

### 디자인 원칙
- **미니멀 디자인**: 불필요한 요소 제거
- **명료한 구분**: 뷰포트와 컨트롤 패널의 시각적 분리
- **반응형**: 다양한 화면 크기 지원
- **일관성**: 통일된 폰트, 색상, 간격

## 개발 구조

### 폴더 구조
```
src/
├── app/
│   ├── layout.tsx          # 앱 레이아웃
│   ├── page.tsx            # 메인 페이지
│   └── globals.css         # 글로벌 스타일
├── components/
│   ├── DeskBuilder.tsx     # 메인 컨테이너 컴포넌트
│   ├── ControlPanel.tsx    # 치수 조정 UI
│   └── DxfViewer.tsx       # DXF 뷰어 컴포넌트
├── styles/
│   ├── DeskBuilder.module.css
│   ├── ControlPanel.module.css
│   └── DxfViewer.module.css
├── utils/
│   └── dxfGenerator.ts     # DXF 생성 유틸리티
└── types/
    └── index.ts            # 타입 정의
```

### 컴포넌트 설계
#### TSX 파일 (로직만)
- 상태 관리 (useState)
- 이벤트 핸들러
- DXF 생성 및 파싱 로직
- 컴포넌트 구조

#### CSS Module 파일 (스타일만)
- 레이아웃 스타일
- 색상, 폰트, 간격
- 반응형 미디어 쿼리
- 애니메이션/트랜지션

## 기술적 구현 세부사항

### 1. DXF 생성 로직 (CAD 표준 준수)
```typescript
// utils/dxfGenerator.ts
import { DxfWriter } from '@tarikjabiri/dxf';

export function generateTopViewDXF(dimensions: DeskDimensions): string {
  const writer = new DxfWriter();
  // LINE 엔티티로 상판 테두리
  // CIRCLE 엔티티로 4개 다리
  return writer.stringify(); // 표준 DXF 포맷
}

export function generateFrontViewDXF(dimensions: DeskDimensions): string
export function generateSideViewDXF(dimensions: DeskDimensions): string
```

### 2. DXF 파싱 & 렌더링 로직
```typescript
// components/DxfViewer.tsx
import DxfParser from 'dxf-parser';

export function DxfViewer({ dxfContent }: { dxfContent: string }) {
  // 1. dxf-parser로 엔티티 추출
  const parsed = parser.parse(dxfContent);
  
  // 2. dxf-viewer 또는 Canvas로 엔티티 렌더링
  // 3. 웹에서 보이는 것 = CAD에서 import되는 것 보장
}
```

### 2. 상태 관리
```typescript
interface DeskDimensions {
  width: number;   // 80-200cm
  depth: number;   // 40-100cm  
  height: number;  // 60-120cm
}
```

### 3. DXF 워크플로우 (CAD 연동 보장)
```
[치수 입력] → [@tarikjabiri/dxf] → [표준 DXF 생성] 
      ↓
[dxf-parser] → [엔티티 파싱] → [dxf-viewer] → [웹 렌더링]
      ↓
[DXF 다운로드] → [AutoCAD/SketchUp에서 정상 import]
```

**핵심 원칙:**
- 웹에서 보이는 것 = CAD에서 import되는 것
- Canvas 직접 그리기 금지 (DXF 엔티티만 사용)
- 실제 DXF 파싱을 통한 렌더링으로 검증

## 성능 요구사항

### 반응성
- 슬라이더 조작 시 500ms 이내 뷰 업데이트
- 부드러운 인터랙션 (60fps 목표)

### 호환성
- 모던 브라우저 지원 (Chrome, Firefox, Safari, Edge)
- 데스크톱 우선, 태블릿 호환

### 최적화
- DXF 생성 캐싱
- 불필요한 리렌더링 방지
- 메모이제이션 활용

## 향후 확장 가능성

### Phase 2 기능
- 다양한 다리 스타일 (원형, 사각형, H형)
- 재질/색상 선택
- 3D 뷰 추가

### Phase 3 기능
- **DXF 파일 다운로드** - 표준 .dxf 파일로 내보내기
- **CAD 호환성 테스트** - AutoCAD, SketchUp 등에서 검증
- 치수 표기 추가 (DIMENSION 엔티티)
- 견적 계산 기능

## 개발 일정

### Week 1
- [x] 프로젝트 설정 및 기본 구조
- [ ] DXF 생성 유틸리티 개발
- [ ] 기본 컴포넌트 구조 작성

### Week 2
- [ ] **DXF 파싱 로직 구현** - dxf-parser 연동
- [ ] **실제 DXF 렌더링** - dxf-viewer 또는 Canvas 엔티티 렌더링
- [ ] **CAD 호환성 1차 검증** - 생성된 DXF 파일 테스트

### Week 3
- [ ] 3개 뷰포트 시스템 구현
- [ ] **DXF 다운로드 기능** 구현
- [ ] **CAD 소프트웨어 호환성 테스트**

### Week 4
- [ ] 테스트 및 버그 수정
- [ ] 성능 최적화
- [ ] 문서화

## 성공 지표

### 기능적 지표
- [x] 프로젝트 초기 설정 완료
- [ ] 3가지 뷰 모두 정상 작동
- [ ] 실시간 치수 조정 기능
- [ ] DXF 정확한 렌더링

### 품질 지표
- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개
- [ ] 로딩 시간 2초 이하
- [ ] 반응 시간 500ms 이하