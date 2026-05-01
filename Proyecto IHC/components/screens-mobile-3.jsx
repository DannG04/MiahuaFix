// screens-mobile-3.jsx — Detail, Feed, Mine, Notifications, Profile
/* global React, CategoryIcon, SeverityChip, StatusPill, AnonBadge, PhotoPlaceholder, TabBar, ReportRow, MapCanvas */

// ───────────────────────── Report Detail ─────────────────────────
function ScreenDetail({ dark, onBack }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';
  const bg = dark ? '#0a1224' : '#faf7f2';

  const timeline = [
    { label: 'Recibido', time: 'Hoy, 10:14', done: true, icon: '📨' },
    { label: 'Confirmado por 8', time: 'Hoy, 10:22', done: true, icon: '✓' },
    { label: 'Asignado a Mantenimiento', time: 'Hoy, 11:03', done: true, icon: '→' },
    { label: 'Resuelto', time: 'Estimado: hoy 16:00', done: false, icon: '' },
  ];

  return (
    <div style={{ height: '100%', background: bg, color: text, display: 'flex', flexDirection: 'column' }}>
      {/* Hero photo */}
      <div style={{ position: 'relative', height: 280, flexShrink: 0 }}>
        <PhotoPlaceholder height="100%" label="foto del reporte" radius={0} />
        <div style={{
          position: 'absolute', top: 56, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'rgba(15,30,61,0.85)', border: 'none',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m6-6-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'rgba(15,30,61,0.85)', border: 'none',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M12 3v13m0-13-5 5m5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, display: 'flex', gap: 6 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }}/>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 16px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            borderRadius: 999, background: '#7c3aed15', color: '#7c3aed',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.08, textTransform: 'uppercase',
          }}>
            <CategoryIcon type="bache" size={12}/> Bache
          </span>
          <SeverityChip level="high"/>
          <StatusPill status="assigned"/>
        </div>

        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, lineHeight: 1.1, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
          Bache grande sobre Av. Reforma
        </h1>
        <div style={{ fontSize: 13, color: sub, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
          Av. Reforma esq. 5 de Mayo · Col. Centro <span style={{ color: 'var(--ink-300)' }}>·</span> hace 1h 14min
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.55, color: dark ? 'rgba(255,255,255,0.8)' : '#2a3348', margin: '0 0 20px' }}>
          Hoyo de unos 50 cm de diámetro en el carril central, con lluvia se llena y no se ve. Ya vi a dos autos dañarse la llanta esta semana.
        </p>

        {/* Confirm CTA */}
        <div style={{
          background: '#0f1e3d', borderRadius: 18, padding: 16, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>¿También lo viste?</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Confirma para priorizar</div>
          </div>
          <button style={{
            background: '#f59e0b', border: 'none', borderRadius: 12,
            padding: '10px 16px', fontSize: 13, fontWeight: 700,
            color: '#0f1e3d', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M7 10v10H3V10h4ZM7 10l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1 6a3 3 0 0 1-3 2H7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            8
          </button>
        </div>

        {/* Timeline */}
        <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 12 }}>
          Estado del reporte
        </div>
        <div style={{
          background: card, border: `1px solid ${border}`,
          borderRadius: 16, padding: 14, marginBottom: 20,
        }}>
          {timeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: i < timeline.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 99,
                  background: t.done ? '#0f1e3d' : 'transparent',
                  border: t.done ? 'none' : `2px dashed ${border}`,
                  display: 'grid', placeItems: 'center', color: '#f59e0b',
                  fontSize: 11, fontWeight: 700,
                }}>{t.done ? '✓' : ''}</div>
                {i < timeline.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 18, background: t.done ? 'var(--amber-500)' : border, opacity: t.done ? 0.3 : 1 }}/>
                )}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.done ? text : sub }}>{t.label}</div>
                <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{t.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Location card */}
        <div style={{
          background: card, border: `1px solid ${border}`, borderRadius: 16,
          padding: 12, display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{ width: 70, height: 70, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <MapCanvas dark={dark} pins={[{ x: 200, y: 250, severity: 'high', pulse: true }]}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: text }}>Av. Reforma 240 · Col. Centro</div>
            <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>19.4326° N · 99.1332° W</div>
            <button style={{
              marginTop: 6, background: 'transparent', border: 'none', padding: 0,
              color: '#d97706', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Abrir en mapa →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Feed (Community) ─────────────────────────
function ScreenFeed({ dark, onSelect }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const bg = dark ? '#0a1224' : '#faf7f2';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const groups = [
    {
      label: 'Activos ahora',
      sub: '3 reportes en curso en tu colonia',
      reports: [
        { id: 11, type: 'bache', title: 'Bache grande sobre Av. Reforma', location: 'Av. Reforma · Col. Centro', time: 'hace 12 min', severity: 'high', votes: 8, status: 'confirmed' },
        { id: 12, type: 'basura', title: 'Basura acumulada en esquina', location: 'Calle Morelos 148', time: 'hace 34 min', severity: 'medium', votes: 4, status: 'assigned' },
      ],
    },
    {
      label: 'Resueltos esta semana',
      sub: '12 problemas atendidos',
      reports: [
        { id: 13, type: 'alumbrado', title: 'Lámpara del parque — reparada', location: 'Parque Hidalgo', time: 'ayer', severity: 'low', votes: 6, status: 'resolved' },
        { id: 14, type: 'agua', title: 'Fuga en banqueta sellada', location: 'Av. Juárez 22', time: 'mar', severity: 'medium', votes: 11, status: 'resolved' },
      ],
    },
  ];

  return (
    <div style={{ height: '100%', background: bg, color: text, overflow: 'auto' }}>
      <div style={{ padding: '56px 16px 14px', position: 'sticky', top: 0, background: bg, zIndex: 10 }}>
        <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1, textTransform: 'uppercase' }}>Comunidad</div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>
          Lo que <em style={{ color: '#d97706', fontStyle: 'italic' }}>pasa</em> en tu ciudad
        </h1>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {[
            { n: '47', l: 'activos', c: '#f59e0b' },
            { n: '124', l: 'resueltos', c: '#22c55e' },
            { n: '2.1h', l: 'promedio', c: '#2563eb' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: card, border: `1px solid ${border}`,
              borderRadius: 14, padding: '10px 12px',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.c, fontFamily: 'Instrument Serif, serif' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 18, marginTop: 18, borderBottom: `1px solid ${border}` }}>
          {['Todo', 'Cerca', 'Mi colonia', 'Tendencias'].map((t, i) => (

            <button key={t} style={{
              padding: '10px 0', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              color: i === 0 ? text : sub,
              borderBottom: i === 0 ? `2px solid #f59e0b` : '2px solid transparent',
              marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '4px 16px 110px' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{g.label}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{g.sub}</div>
              </div>
              <span style={{ fontSize: 11, color: '#d97706', fontWeight: 600 }}>Ver todo</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.reports.map(r => <ReportRow key={r.id} report={r} dark={dark} onClick={onSelect}/>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── Mine ─────────────────────────
function ScreenMine({ dark, onSelect }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const bg = dark ? '#0a1224' : '#faf7f2';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const reports = [
    { id: 21, type: 'bache', title: 'Bache grande sobre Av. Reforma', location: 'Col. Centro', time: 'hoy, 10:14', severity: 'high', votes: 8, status: 'assigned' },
    { id: 22, type: 'basura', title: 'Basura acumulada en esquina', location: 'Calle Morelos 148', time: 'ayer', severity: 'medium', votes: 4, status: 'resolved' },
    { id: 23, type: 'alumbrado', title: 'Lámpara fundida en el parque', location: 'Parque Hidalgo', time: 'lun', severity: 'low', votes: 2, status: 'resolved' },
  ];

  return (
    <div style={{ height: '100%', background: bg, color: text, overflow: 'auto', padding: '56px 16px 110px' }}>
      <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1, textTransform: 'uppercase' }}>Tu historial</div>
      <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 18px', letterSpacing: '-0.01em' }}>
        Mis reportes
      </h1>

      {/* Impact card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1e3d 0%, #162a52 100%)',
        borderRadius: 20, padding: 18, color: '#faf7f2', marginBottom: 22,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 140, height: 140,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.25), transparent 60%)',
        }}/>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.1 }}>
          Tu impacto este mes
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 14, alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, lineHeight: 1, color: '#f59e0b' }}>7</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Reportes enviados</div>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)' }}/>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, lineHeight: 1 }}>5</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Resueltos</div>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)' }}/>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, lineHeight: 1 }}>34</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Confirmaron</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
        {['Todos (7)', 'Abiertos (2)', 'Resueltos (5)'].map((f, i) => (
          <span key={i} style={{
            flexShrink: 0, padding: '6px 12px', borderRadius: 999,
            background: i === 0 ? '#0f1e3d' : card,
            color: i === 0 ? '#f59e0b' : sub,
            border: i === 0 ? 'none' : `1px solid ${border}`,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{f}</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map(r => <ReportRow key={r.id} report={r} dark={dark} onClick={onSelect}/>)}
      </div>
    </div>
  );
}

// ───────────────────────── Notifications ─────────────────────────
function ScreenNotifications({ dark, onBack }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const bg = dark ? '#0a1224' : '#faf7f2';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const notifs = [
    { when: 'hace 5 min', title: 'Tu reporte cambió a "En camino"', desc: 'Cuadrilla de bacheo yendo a Av. Reforma.', type: 'status', unread: true, color: '#2563eb' },
    { when: 'hace 34 min', title: '3 personas confirmaron tu reporte', desc: 'Basura acumulada · Calle Morelos', type: 'vote', unread: true, color: '#f59e0b' },
    { when: 'hace 2 h', title: 'Reporte resuelto cerca de ti', desc: 'Lámpara reparada — Parque Hidalgo', type: 'resolved', unread: false, color: '#22c55e' },
    { when: 'ayer', title: 'Semana con 12 problemas resueltos', desc: 'Gracias por reportar. Así vamos.', type: 'info', unread: false, color: '#6b7280' },
  ];

  return (
    <div style={{ height: '100%', background: bg, color: text, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '56px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 12, background: card,
          border: `1px solid ${border}`, display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m6-6-6 6 6 6" stroke={text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.1 }}>Centro de avisos</div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, lineHeight: 1 }}>Notificaciones</div>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: '#d97706', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Marcar leídas</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 16px 40px' }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '14px 0',
            borderTop: i > 0 ? `1px solid ${border}` : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: `${n.color}15`, color: n.color,
              display: 'grid', placeItems: 'center', position: 'relative',
            }}>
              {n.type === 'status' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m12 8 3 4-3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
              {n.type === 'vote' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 10v10H3V10h4ZM7 10l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1 6a3 3 0 0 1-3 2H7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>}
              {n.type === 'resolved' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 10-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {n.type === 'info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v.01M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
              {n.unread && <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 99, background: '#ef4444', border: `2px solid ${bg}` }}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: text, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: sub, flexShrink: 0 }}>{n.when}</div>
              </div>
              <div style={{ fontSize: 13, color: sub, marginTop: 4, lineHeight: 1.4 }}>{n.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── Profile ─────────────────────────
function ScreenProfile({ dark, toggleDark }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const bg = dark ? '#0a1224' : '#faf7f2';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const Section = ({ title, children }) => (
    <>
      <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1, textTransform: 'uppercase', margin: '20px 8px 8px' }}>{title}</div>
      <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, overflow: 'hidden' }}>{children}</div>
    </>
  );

  const Row = ({ icon, label, detail, last, toggle, on, onClick }) => (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', cursor: onClick ? 'pointer' : 'default',
      borderBottom: last ? 'none' : `1px solid ${border}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,30,61,0.05)',
        color: sub, display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: text }}>{label}</div>
      {detail && <span style={{ fontSize: 12, color: sub }}>{detail}</span>}
      {toggle ? (
        <div onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} style={{
          width: 40, height: 24, borderRadius: 99, padding: 2,
          background: on ? '#f59e0b' : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,30,61,0.2)'),
          transition: 'background .2s', cursor: 'pointer',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 99, background: '#fff',
            transform: on ? 'translateX(16px)' : 'translateX(0)',
            transition: 'transform .2s',
          }}/>
        </div>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="m9 5 7 7-7 7" stroke={sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </div>
  );

  return (
    <div style={{ height: '100%', background: bg, color: text, overflow: 'auto', padding: '56px 16px 110px' }}>
      <div style={{
        background: card, border: `1px solid ${border}`,
        borderRadius: 22, padding: 20, marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: 'linear-gradient(135deg, #0f1e3d 0%, #162a52 100%)',
          display: 'grid', placeItems: 'center',
          color: '#f59e0b',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1 }}>Usuario anónimo</div>
          <div style={{ fontSize: 12, color: sub, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>#a7f9-3e2c</div>
          <div style={{ marginTop: 8 }}><AnonBadge compact/></div>
        </div>
      </div>

      <p style={{
        fontSize: 12, color: sub, lineHeight: 1.5, margin: '6px 8px 4px',
        textWrap: 'pretty',
      }}>
        No tenemos tu nombre, correo ni matrícula. Tu ID es un código aleatorio que puedes borrar en cualquier momento.
      </p>

      <Section title="Apariencia">
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-8-8c0 4 4 8 8 8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>} label="Modo oscuro" toggle on={dark} onClick={toggleDark} last/>
      </Section>

      <Section title="Avisos">
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 1 1 12 0v5l2 3H4l2-3V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>} label="Notificaciones push" toggle on={true} onClick={()=>{}}/>
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z" stroke="currentColor" strokeWidth="1.7"/></svg>} label="Alertas de mi colonia" detail="Col. Centro" />
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.7"/></svg>} label="Resumen semanal" last />
      </Section>

      <Section title="Privacidad">
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7"/></svg>} label="Remover metadatos de fotos" toggle on={true} />
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>} label="Borrar historial" detail="Cada 90 días" />
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a9 9 0 1 1-3.5-7.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M21 4v6h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Regenerar mi ID anónimo" last />
      </Section>

      <Section title="Ayuda">
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M9 9a3 3 0 1 1 3 3v2M12 18v.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>} label="Preguntas frecuentes"/>
        <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 11.5A8.5 8.5 0 1 1 12.5 3 9 9 0 0 1 21 11.5Z" stroke="currentColor" strokeWidth="1.7"/><path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Política de privacidad" last/>
      </Section>
    </div>
  );
}

Object.assign(window, { ScreenDetail, ScreenFeed, ScreenMine, ScreenNotifications, ScreenProfile });
