import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PropsTest from './PropsTest.tsx'

function Root() {
  const [tab, setTab] = useState<'demo' | 'props'>('demo');
  return (
    <StrictMode>
      <div style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #0f548c', padding: '0 20px' }}>
          {(['demo', 'props'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', border: 'none', cursor: 'pointer',
              background: tab === t ? '#0f548c' : 'transparent',
              color: tab === t ? '#fff' : '#333',
              fontWeight: tab === t ? 700 : 400,
              fontSize: 13,
            }}>
              {t === 'demo' ? 'Demo' : 'Props Test'}
            </button>
          ))}
        </div>
        {tab === 'demo' ? <App /> : <PropsTest />}
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />)
