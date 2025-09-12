# CLAUDE.md

이 파일은 이 리포지토리에서 작업할 때 Claude Code (claude.ai/code)에게 가이드를 제공합니다.

## 개발 명령어

### 개발 서버 실행
```bash
npm run dev
```
- Next.js 개발 서버를 Turbopack과 함께 실행합니다
- http://localhost:3000에서 확인 가능

### 빌드
```bash
npm run build
```
- 프로덕션용 빌드를 생성합니다 (Turbopack 사용)

### 배포
```bash
npm start
```
- 프로덕션 서버를 시작합니다

### 린팅
```bash
npm run lint
```
- ESLint로 코드 품질을 검사합니다

## 프로젝트 아키텍처

### 프로젝트 목표
DXF 기반 책상 빌더 웹 애플리케이션으로, 사용자가 폭(Width), 깊이(Depth), 높이(Height)를 실시간으로 조정하여 4개 다리를 가진 책상을 설계할 수 있는 웹 기반 컨피규레이터입니다.

### 핵심 기술 스택
- **Next.js 15** (App Router 방식)
- **TypeScript** (타입 안정성)
- **CSS Modules** (스타일과 로직 분리)
- **DXF 처리**: @tarikjabiri/dxf, dxf-parser, dxf-viewer

### 아키텍처 구조

#### DXF 기반 렌더링 시스템
- 3가지 뷰포트 제공: Top View, Front View, Side View
- 각 뷰포트는 독립적인 DXF 렌더링
- 오토캐드/스케치업 스타일의 선형 표현 (면 렌더링 없음)
- 실시간 치수 변경 시 모든 뷰 동시 업데이트

#### 컴포넌트 설계 철학
- **TSX 파일**: 상태 관리, 이벤트 핸들러, DXF 생성 로직만 포함
- **CSS Module 파일**: 레이아웃, 색상, 폰트, 반응형 스타일만 포함
- 완전한 로직과 스타일 분리

#### 상태 관리
```typescript
interface DeskDimensions {
  width: number;   // 80-200cm
  depth: number;   // 40-100cm  
  height: number;  // 60-120cm
}
```

### 계획된 폴더 구조
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

### 성능 요구사항
- 슬라이더 조작 시 500ms 이내 뷰 업데이트
- DXF 생성 캐싱으로 성능 최적화
- 불필요한 리렌더링 방지
- 메모이제이션 활용

### 개발 시 주의사항
- TypeScript 경로 별칭: `@/*` → `./src/*`
- CSS Modules 사용 필수 (글로벌 CSS 최소화)
- DXF 라이브러리 3개 모두 활용하여 완전한 워크플로우 구현
- 미니멀 디자인과 명료한 구분 유지