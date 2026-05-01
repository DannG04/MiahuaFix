// screens-mobile.jsx — Mobile screens for ReporteSano
/* global React, CategoryIcon, SeverityChip, StatusPill, AnonBadge, PhotoPlaceholder, TabBar, ReportRow */

// ───────────────────────── Onboarding ─────────────────────────
function ScreenOnboarding({ dark }) {
  const bg = dark ? '#0a1224' : '#faf7f2';
  const text = dark ? '#faf7f2' : '#0a1530';
  return (
    <div style={{
      height: '100%', background: bg, color: text,
      padding: '72px 28px 40px', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative radial */}
      <div style={{
        position: 'absolute', top: -100, right: -80, width: 320, height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.16), transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', top: 90, left: -60, width: 180, height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,30,61,0.08), transparent 60%)',
      }} />

      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8,
        fontSize: 12, color: dark ? 'rgba(255,255,255,0.6)' : '#5b6478',
        fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1,
        textTransform: 'uppercase', marginBottom: 40,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: '#f59e0b' }} />
        Ciudad · Reportes urbanos
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 46, lineHeight: 1,
          letterSpacing: '-0.01em', marginBottom: 18,
          textWrap: 'balance',
        }}>
          Tu reporte<br/>mejora tu<br/>
          <em style={{ color: '#f59e0b', fontStyle: 'italic' }}>colonia</em>.
        </div>
        <p style={{
          fontSize: 15.5, lineHeight: 1.45, color: dark ? 'rgba(255,255,255,0.7)' : '#2a3348',
          maxWidth: 300, margin: 0,
        }}>
          Un bache, basura acumulada, una lámpara fundida o una fuga. Repórtalo en 30 segundos,
          sin dar tu nombre, y avisa al ayuntamiento.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          <AnonBadge />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'rgba(245, 158, 11, 0.14)', color: '#d97706',
            fontSize: 11, fontWeight: 600,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sin crear cuenta
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: i === 0 ? 24 : 6, height: 6, borderRadius: 3,
            background: i === 0 ? '#f59e0b' : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,30,61,0.16)'),
            transition: 'all .3s',
          }}/>
        ))}
      </div>

      <button style={{
        background: '#0f1e3d', color: '#faf7f2',
        border: 'none', height: 56, borderRadius: 16,
        fontSize: 16, fontWeight: 600, fontFamily: 'Inter',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        cursor: 'pointer',
        boxShadow: '0 10px 24px rgba(15,30,61,0.25)',
      }}>
        Empezar
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button style={{
        background: 'transparent', color: dark ? 'rgba(255,255,255,0.6)' : '#5b6478',
        border: 'none', marginTop: 12, fontSize: 13, cursor: 'pointer',
        fontFamily: 'Inter', fontWeight: 500,
      }}>
        Cómo protegemos tu anonimato →
      </button>
    </div>
  );
}

// ───────────────────────── Home (Map + Feed hybrid) ─────────────────────────
function MapCanvas({ dark, pins = [] }) {
  // Stylized campus map — abstract shapes, no accurate geography
  const mapBg = dark ? '#0a1224' : '#eef0e8';
  const road = dark ? '#1a2340' : '#d8dccc';
  const bldg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,30,61,0.08)';
  const green = dark ? 'rgba(34,197,94,0.08)' : 'rgba(125,160,96,0.22)';
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"
         style={{ display: 'block', background: mapBg }}>
      {/* greens */}
      <rect x="0" y="0" width="400" height="500" fill={mapBg}/>
      <path d="M0 340 Q100 310 180 340 T400 320 V500 H0 Z" fill={green}/>
      <circle cx="310" cy="120" r="60" fill={green}/>
      <circle cx="70" cy="220" r="38" fill={green}/>

      {/* roads */}
      <path d="M-10 250 Q150 240 250 260 T410 250" stroke={road} strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M200 -10 Q210 120 230 260 T250 510" stroke={road} strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M30 60 L160 100 L200 90" stroke={road} strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M260 400 L360 420" stroke={road} strokeWidth="6" fill="none" strokeLinecap="round"/>

      {/* buildings */}
      <rect x="40" y="140" width="70" height="54" rx="4" fill={bldg}/>
      <rect x="130" y="150" width="44" height="70" rx="4" fill={bldg}/>
      <rect x="250" y="140" width="90" height="60" rx="4" fill={bldg}/>
      <rect x="60" y="300" width="90" height="36" rx="4" fill={bldg}/>
      <rect x="280" y="310" width="60" height="60" rx="4" fill={bldg}/>
      <rect x="160" y="380" width="70" height="50" rx="4" fill={bldg}/>

      {/* labels */}
      <text x="75" y="170" fontFamily="JetBrains Mono" fontSize="8" fill={dark ? 'rgba(255,255,255,0.35)' : 'rgba(15,30,61,0.35)'}>MERCADO</text>
      <text x="295" y="175" fontFamily="JetBrains Mono" fontSize="8" fill={dark ? 'rgba(255,255,255,0.35)' : 'rgba(15,30,61,0.35)'}>PLAZA</text>
      <text x="80" y="322" fontFamily="JetBrains Mono" fontSize="8" fill={dark ? 'rgba(255,255,255,0.35)' : 'rgba(15,30,61,0.35)'}>ESCUELA</text>
      <text x="295" y="345" fontFamily="JetBrains Mono" fontSize="8" fill={dark ? 'rgba(255,255,255,0.35)' : 'rgba(15,30,61,0.35)'}>PARQUE</text>

      {/* pins */}
      {pins.map((p, i) => {
        const col = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }[p.severity];
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            {p.pulse && <circle r="18" fill={col} opacity="0.18"><animate attributeName="r" from="10" to="22" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.3" to="0" dur="1.6s" repeatCount="indefinite"/></circle>}
            <circle r="13" fill="#fff" stroke={col} strokeWidth="2.5"/>
            <circle r="6" fill={col}/>
          </g>
        );
      })}

      {/* "you are here" */}
      <g transform="translate(200 280)">
        <circle r="26" fill="#2563eb" opacity="0.14">
          <animate attributeName="r" from="14" to="28" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.25" to="0" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle r="9" fill="#2563eb" stroke="#fff" strokeWidth="3"/>
      </g>
    </svg>
  );
}

function ScreenHome({ dark, onReport, onSelectReport, view = 'map', setView }) {
  const bg = dark ? '#0a1224' : '#faf7f2';
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const pins = [
    { x: 75, y: 168, severity: 'high', pulse: true },
    { x: 160, y: 185, severity: 'medium' },
    { x: 300, y: 155, severity: 'low' },
    { x: 105, y: 315, severity: 'high' },
    { x: 310, y: 340, severity: 'medium' },
    { x: 195, y: 400, severity: 'low' },
    { x: 265, y: 230, severity: 'medium' },
  ];

  const reports = [
    { id: 1, type: 'bache', title: 'Bache grande en avenida', location: 'Av. Reforma esq. 5 de Mayo', time: 'hace 12 min', severity: 'high', votes: 8, status: 'confirmed' },
    { id: 2, type: 'basura', title: 'Basura acumulada en esquina', location: 'Calle Morelos 148', time: 'hace 34 min', severity: 'medium', votes: 4, status: 'assigned' },
    { id: 3, type: 'alumbrado', title: 'Lámpara fundida', location: 'Parque Hidalgo', time: 'hace 1 h', severity: 'low', votes: 2, status: 'pending' },
  ];

  return (
    <div style={{ height: '100%', background: bg, color: text, position: 'relative' }}>
      {/* Top overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '56px 16px 12px',
        background: dark
          ? 'linear-gradient(180deg, rgba(10,18,36,0.94) 40%, rgba(10,18,36,0))'
          : 'linear-gradient(180deg, rgba(250,247,242,0.94) 40%, rgba(250,247,242,0))',
        paddingTop: 58,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1, textTransform: 'uppercase' }}>Col. Centro · CDMX</div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, lineHeight: 1 }}>Hola,  <em style={{ color: '#d97706', fontStyle: 'italic' }}>buen día</em></div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 14, background: card,
            border: `1px solid ${border}`, display: 'grid', placeItems: 'center',
            position: 'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 8a6 6 0 1 1 12 0v5l2 3H4l2-3V8Z" stroke={text} strokeWidth="1.7" strokeLinejoin="round"/>
              <path d="M10 19a2 2 0 0 0 4 0" stroke={text} strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 99, background: '#ef4444', border: '2px solid ' + card }} />
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: card, border: `1px solid ${border}`,
          borderRadius: 14, padding: '10px 14px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={sub} strokeWidth="1.8"/><path d="m20 20-4-4" stroke={sub} strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 14, color: sub, flex: 1 }}>Buscar calle, colonia, tipo…</span>
          <div style={{ width: 1, height: 16, background: border }}/>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: '#d97706', fontWeight: 600,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 5h18l-7 9v5l-4 2v-7L3 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
            3
          </span>
        </div>

        {/* View toggle */}
        <div style={{
          marginTop: 12, display: 'inline-flex', background: card,
          border: `1px solid ${border}`, borderRadius: 10, padding: 3,
        }}>
          {['map', 'list'].map(v => (
            <button key={v} onClick={() => setView && setView(v)} style={{
              border: 'none', padding: '6px 14px', fontSize: 12, fontWeight: 600,
              borderRadius: 7, cursor: 'pointer',
              background: view === v ? '#0f1e3d' : 'transparent',
              color: view === v ? '#f59e0b' : sub,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {v === 'map' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
              {v === 'map' ? 'Mapa' : 'Lista'}
            </button>
          ))}
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && (
        <>
          <div style={{ position: 'absolute', inset: 0 }}>
            <MapCanvas dark={dark} pins={pins} />
          </div>

          {/* Filter chips */}
          <div style={{
            position: 'absolute', top: 210, left: 16, right: 16, zIndex: 20,
            display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4,
          }}>
            {[
              { l: 'Todos', a: true },
              { l: 'Alto', c: '#ef4444' },
              { l: 'Medio', c: '#f59e0b' },
              { l: 'Bajo', c: '#22c55e' },
              { l: 'Hoy' },
              { l: '< 500m' },
            ].map((f, i) => (
              <span key={i} style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 999,
                background: f.a ? '#0f1e3d' : card,
                color: f.a ? '#f59e0b' : (f.c || text),
                border: f.a ? 'none' : `1px solid ${border}`,
                fontSize: 12, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {f.c && !f.a && <span style={{ width: 6, height: 6, borderRadius: 99, background: f.c }}/>}
                {f.l}
              </span>
            ))}
          </div>

          {/* Bottom sheet preview */}
          <div style={{
            position: 'absolute', bottom: 90, left: 12, right: 12, zIndex: 20,
            background: card, borderRadius: 18, padding: 14,
            border: `1px solid ${border}`,
            boxShadow: '0 16px 40px rgba(10,21,48,0.14)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: sub,
                letterSpacing: 0.1, textTransform: 'uppercase',
              }}>Cerca de ti · 280m</span>
              <span style={{ flex: 1, height: 1, background: border }}/>
              <span style={{ fontSize: 11, color: '#d97706', fontWeight: 600 }}>Ver 24 más →</span>
            </div>
            <ReportRow report={reports[0]} dark={dark} onClick={onSelectReport}/>
          </div>

          {/* Zoom / locate chips */}
          <div style={{
            position: 'absolute', right: 12, top: 260, zIndex: 20,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {[
              <svg key="a" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={text} strokeWidth="2" strokeLinecap="round"/></svg>,
              <svg key="b" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={text} strokeWidth="2" strokeLinecap="round"/></svg>,
              <svg key="c" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill={text}/><circle cx="12" cy="12" r="8" stroke={text} strokeWidth="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={text} strokeWidth="1.8"/></svg>,
            ].map((ic, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: 12,
                background: card, border: `1px solid ${border}`,
                display: 'grid', placeItems: 'center', cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(10,21,48,0.08)',
              }}>{ic}</button>
            ))}
          </div>
        </>
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ padding: '240px 12px 110px', height: '100%', overflow: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...reports, ...reports].map((r, i) => (
              <ReportRow key={i} report={r} dark={dark} onClick={onSelectReport}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ScreenOnboarding, ScreenHome, MapCanvas });
