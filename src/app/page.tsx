import DeskBuilder from '@/components/DeskBuilder';

export default function Home() {
  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="title-large">3D Desk Builder</h1>
        {/* <p className="body-large">
          Design your perfect desk with real-time 3D visualization
        </p> */}
      </header>
      <DeskBuilder />
    </div>
  );
}
