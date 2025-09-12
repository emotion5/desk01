# 250909-desk - Desk Builder PRD (Product Requirements Document)

## 프로젝트 개요

### 프로젝트명
250909-desk - DXF 기반 책상 빌더 웹 애플리케이션

### 목표
사용자가 폭(Width), 깊이(Depth), 높이(Height)를 조정하여 4개 다리를 가진 책상을 실시간으로 설계할 수 있는 웹 기반 컨피규레이터 제작

### 핵심 비전
- 오토캐드/스케치업과 같은 전문 CAD 소프트웨어의 선형 표현 방식을 웹에서 구현
- DXF 표준을 활용한 정확한 도면 생성 및 표시
- 직관적인 UI/UX를 통한 실시간 치수 조정

## 기술 스택

### Frontend Framework
- **Next.js 15** (App Router 방식)
- **TypeScript** (타입 안정성)
- **CSS Modules** (스타일과 로직 분리)

### DXF 처리
- **@tarikjabiri/dxf** - DXF 파일 생성
- **dxf-parser** - DXF 파싱
- **dxf-viewer** - DXF 뷰어 기능

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

### 2. 다중 뷰포트 시스템
#### 2.1 3가지 뷰 제공
1. **Top View (상부 뷰)**
   - 책상을 위에서 내려다본 평면도
   - 상판의 직사각형과 4개 다리의 위치 표시
   
2. **Front View (정면 뷰)**
   - 책상의 정면도
   - 높이와 폭, 다리 구조 표시
   
3. **Side View (측면 뷰)**
   - 책상의 측면도
   - 깊이와 높이, 다리 구조 표시

#### 2.2 뷰포트 특징
- 각 뷰포트는 독립적인 DXF 렌더링
- 동시에 모든 뷰 표시
- 치수 변경 시 실시간 업데이트

### 3. DXF 기반 렌더링
#### 3.1 도면 스타일
- 선형(라인) 표현만 사용
- 면(Face) 렌더링 없음
- 검은색 선, 흰색/회색 배경
- 오토캐드/스케치업 스타일 모방

#### 3.2 책상 구조 표현
- **상판**: 직사각형 라인
- **다리 4개**: 원형 또는 사각형 라인 (상판 모서리 근처)
- **연결부**: 필요시 다리와 상판 연결선

## UI/UX 디자인

### 레이아웃 구조
```
┌─────────────────┬─────────────────────────────┐
│                 │        Desk Dimensions      │
│                 │                             │
│     Top View    │   Width  [====o===] 120cm  │
│                 │   Depth  [===o====] 60cm   │
│                 │   Height [===o====] 75cm   │
├─────────────────┤                             │
│   Front View    │   [Reset to Default]        │
│                 │                             │
├─────────────────┤                             │
│   Side View     │                             │
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

### 1. DXF 생성 로직
```typescript
// utils/dxfGenerator.ts
export function generateTopView(width: number, depth: number): string
export function generateFrontView(width: number, height: number): string  
export function generateSideView(depth: number, height: number): string
```

### 2. 상태 관리
```typescript
interface DeskDimensions {
  width: number;   // 80-200cm
  depth: number;   // 40-100cm  
  height: number;  // 60-120cm
}
```

### 3. DXF 뷰어 통합
- @tarikjabiri/dxf로 DXF 생성
- dxf-viewer로 웹에서 렌더링
- Canvas 또는 SVG 기반 표시

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
- DXF 파일 다운로드
- 치수 표기 추가
- 견적 계산 기능

## 개발 일정

### Week 1
- [x] 프로젝트 설정 및 기본 구조
- [ ] DXF 생성 유틸리티 개발
- [ ] 기본 컴포넌트 구조 작성

### Week 2
- [ ] 뷰포트 시스템 구현
- [ ] 컨트롤 패널 UI 개발
- [ ] CSS 모듈 스타일링

### Week 3
- [ ] DXF 뷰어 통합
- [ ] 실시간 업데이트 로직
- [ ] 반응형 디자인

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