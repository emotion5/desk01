# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
npm run dev
```
- Runs Next.js development server with Turbopack
- Available at http://localhost:3000 (or next available port)

### Build
```bash
npm run build
```
- Creates production build using Turbopack

### Production Server
```bash
npm start
```
- Starts production server

### Linting
```bash
npm run lint
```
- Runs ESLint to check code quality

## Project Architecture

### Project Goal
3D desk configurator web application where users can adjust width, depth, and height in real-time to design desks with 4 legs. The application provides interactive 3D visualization with solid/wireframe and perspective/orthographic viewing modes.

### Core Technology Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React Three Fiber** + **@react-three/drei** for 3D rendering
- **Three.js** for WebGL-based 3D graphics
- **Apple Clean Minimalism** design system

### Component Architecture

#### Core State Management
```typescript
interface DeskDimensions {
  width: number;   // 80-200cm
  depth: number;   // 40-100cm
  height: number;  // 60-120cm
}
```

#### Component Hierarchy
- **DeskBuilder**: Main container with grid layout (2fr 1fr)
- **ThreeDViewer**: 3D rendering with dual view modes (solid/line, perspective/orthographic)
- **ControlPanel**: Dimension sliders with real-time updates

#### 3D Rendering System
- **Materials**: White glossy tabletop (`roughness: 0.1`) + silver metallic legs (`metalness: 0.8`)
- **Lighting**: Environment preset "apartment" with warm directional lights
- **Camera**: Dynamic switching between perspective and orthographic projection
- **Controls**: OrbitControls with 60-degree vertical angle limits
- **Coordinate System**: Origin at leg center height with RGB axis helpers

#### Design System
- **Monochrome UI**: Dark gray accents (`#4a4a4a`) replacing blue
- **Sharp Corners**: All buttons and containers use `borderRadius: '0'`
- **Apple Clean**: Consistent spacing variables and typography classes
- **Development Tools**: Next.js dev indicators disabled via `next.config.ts`

### Key Implementation Details

#### View Mode Toggle
Two independent button groups:
- Solid/Line rendering (mesh vs wireframe with EdgesGeometry)
- Perspective/Orthographic projection (dynamic camera switching via useThree)

#### Layout Stability
- Fixed header height (`minHeight: '80px'`) prevents view area shifts
- Button containers use consistent sizing to avoid reflow
- Grid uses `alignItems: 'stretch'` for equal height columns

#### Material Configuration
- Tabletop: Non-metallic white with low roughness for glossy finish
- Legs: High metalness silver with minimal roughness for realistic metal
- Line mode: Transparent mesh with black edge lines, no face diagonals