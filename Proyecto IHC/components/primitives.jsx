// primitives.jsx — Shared primitives for ReporteSano

// Severity chip
function SeverityChip({ level = 'medium', size = 'sm' }) {
  const cfg = {
    low:    { bg: 'var(--green-100)', color: 'var(--green-600)', dot: 'var(--green-500)', label: 'Bajo' },
    medium: { bg: 'var(--amber-bg)',  color: 'var(--amber-600)', dot: 'var(--amber-500)', label: 'Medio' },
    high:   { bg: 'var(--red-100)',   color: 'var(--red-600)',   dot: 'var(--red-500)',   label: 'Alto' },
  }[level];
  const pad = size === 'lg' ? '6px 12px' : '3px 9px';
  const fs = size === 'lg' ? 13 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 999, background: cfg.bg,
      color: cfg.color, fontSize: fs, fontWeight: 600,
      letterSpacing: 0.1,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// Status pill (for report status lifecycle)
function StatusPill({ status = 'pending' }) {
  const cfg = {
    pending:    { label: 'Recibido',    color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
    confirmed:  { label: 'Confirmado',  color: '#d97706', bg: 'var(--amber-bg)' },
    assigned:   { label: 'En camino',   color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
    resolved:   { label: 'Resuelto',    color: 'var(--green-600)', bg: 'var(--green-100)' },
  }[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 6, background: cfg.bg,
      color: cfg.color, fontSize: 11, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: 0.06,
    }}>{cfg.label}</span>
  );
}

// Category icon (monoline, inline SVG — urban report categories)
function CategoryIcon({ type = 'bache', size = 22, color = 'currentColor' }) {
  const s = size;
  const stroke = { stroke: color, strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'bache') return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M3 18h18" {...stroke} />
      <path d="M6 18c0-3 2-5 6-5s6 2 6 5" {...stroke} />
      <path d="M8 14l-1-3M16 14l1-3M12 13V9" {...stroke} />
    </svg>
  );
  if (type === 'agua') return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" {...stroke} />
      <path d="M9 14a3 3 0 0 0 3 3" {...stroke} />
    </svg>
  );
  if (type === 'basura') return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M4 7h16" {...stroke} />
      <path d="M9 7V4h6v3" {...stroke} />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" {...stroke} />
      <path d="M10 11v7M14 11v7" {...stroke} />
    </svg>
  );
  if (type === 'alumbrado') return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M12 3a5 5 0 0 0-3 9v3h6v-3a5 5 0 0 0-3-9Z" {...stroke} />
      <path d="M10 19h4M11 22h2" {...stroke} />
    </svg>
  );
  if (type === 'drenaje') return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M5 9h14M5 15h14M9 4v16M15 4v16" {...stroke} />
    </svg>
  );
  if (type === 'grafiti') return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d="M4 20h16M6 16l5-9 3 2-5 9H6v-2Z" {...stroke} />
      <path d="M13 9l3-5 3 2-3 5" {...stroke} />
    </svg>
  );
  return null;
}

// Anon indicator
function AnonBadge({ compact = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: compact ? '3px 8px' : '5px 11px',
      borderRadius: 999,
      background: 'rgba(15, 30, 61, 0.06)',
      color: 'var(--navy-800)',
      fontSize: compact ? 10 : 11, fontWeight: 600,
      letterSpacing: 0.04,
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Anónimo
    </span>
  );
}

// Placeholder photo (subtle striped pattern)
function PhotoPlaceholder({ width = '100%', height = 160, label = 'foto', radius = 12 }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: `repeating-linear-gradient(135deg, #e8e3d8 0 12px, #ede8dc 12px 24px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--ink-500)', fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase',
    }}>{label}</div>
  );
}

// Bottom tab bar (mobile)
function TabBar({ active = 'home', dark = false, onNav = () => {} }) {
  const items = [
    { id: 'home', label: 'Mapa', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M9 4v14M15 6v14" stroke={c} strokeWidth="1.7"/>
      </svg>
    )},
    { id: 'feed', label: 'Comunidad', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.7"/>
        <circle cx="17" cy="10" r="2.5" stroke={c} strokeWidth="1.7"/>
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M15 18c0-2 2-4 4-4s4 1.5 4 3.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'report', label: 'Reportar', primary: true, icon: (c) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'mine', label: 'Mis reportes', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke={c} strokeWidth="1.7"/>
        <path d="M8 9h8M8 13h8M8 17h5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'profile', label: 'Perfil', icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.7"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )},
  ];
  const bg = dark ? 'rgba(14, 20, 36, 0.92)' : 'rgba(255, 255, 255, 0.92)';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,30,61,0.08)';
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 10,
      background: bg,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      zIndex: 40,
    }}>
      {items.map(it => {
        const isActive = active === it.id;
        if (it.primary) return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            border: 'none', background: 'var(--amber-500)',
            color: 'var(--navy-800)', width: 54, height: 54, borderRadius: 20,
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4), 0 0 0 4px rgba(255,255,255,0.6)',
            marginBottom: 4, cursor: 'pointer',
          }}>
            {it.icon('var(--navy-800)')}
          </button>
        );
        const c = isActive ? (dark ? 'var(--amber-500)' : 'var(--navy-800)') : (dark ? 'rgba(255,255,255,0.5)' : 'var(--ink-400)');
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            border: 'none', background: 'transparent', padding: '6px 2px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: c, fontSize: 10, fontWeight: 600, cursor: 'pointer',
            minWidth: 54,
          }}>
            {it.icon(c)}
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Simple 3-line card for a report in lists
function ReportRow({ report, onClick, dark = false, showVotes = true }) {
  const { type, title, location, time, severity, votes, status } = report;
  const typeColor = {
    bache: '#7c3aed', agua: '#0ea5e9', basura: '#65a30d', alumbrado: '#eab308', drenaje: '#0891b2', grafiti: '#db2777',
  }[type];
  const typeLabel = {
    bache: 'Bache', agua: 'Fuga de agua', basura: 'Basura', alumbrado: 'Alumbrado', drenaje: 'Drenaje', grafiti: 'Grafiti',
  }[type];
  const bg = dark ? 'rgba(255,255,255,0.04)' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';
  const sub = dark ? 'rgba(255,255,255,0.55)' : 'var(--ink-500)';
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', border: `1px solid ${border}`,
      background: bg, borderRadius: 16, padding: '14px 14px',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      cursor: 'pointer', color: 'inherit',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${typeColor}15`, color: typeColor,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <CategoryIcon type={type} size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: typeColor,
            letterSpacing: 0.08, textTransform: 'uppercase',
          }}>{typeLabel}</span>
          <span style={{ color: 'var(--ink-300)', fontSize: 10 }}>·</span>
          <span style={{ fontSize: 10, color: sub }}>{time}</span>
          {status && <span style={{ marginLeft: 'auto' }}><StatusPill status={status} /></span>}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 600, lineHeight: 1.3,
          color: dark ? '#f5f1ea' : 'var(--ink-900)',
          marginBottom: 2,
        }}>{title}</div>
        <div style={{ fontSize: 12, color: sub, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {location}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <SeverityChip level={severity} />
          {showVotes && (
            <span style={{ fontSize: 11, color: sub, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M7 10v10H3V10h4ZM7 10l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1 6a3 3 0 0 1-3 2H7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {votes} confirmaciones
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { SeverityChip, StatusPill, CategoryIcon, AnonBadge, PhotoPlaceholder, TabBar, ReportRow });
