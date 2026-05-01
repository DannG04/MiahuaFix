// dashboard.jsx — Web admin dashboard with working sidebar nav
/* global React, CategoryIcon, SeverityChip, StatusPill, MapCanvas */

function AdminDashboard({ dark }) {
  const [activeNav, setActiveNav] = React.useState('Panel');
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const bg = dark ? '#0a1224' : '#faf7f2';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,30,61,0.08)';

  const reports = [
    { id: 'R-2847', type: 'bache',    title: 'Bache grande sobre Av. Reforma',    location: 'Reforma esq. 5 de Mayo', severity: 'high',   votes: 8,  status: 'assigned',  time: '10:14', assignee: 'Equipo A' },
    { id: 'R-2846', type: 'basura',   title: 'Basura acumulada en esquina',        location: 'Calle Morelos 148',      severity: 'medium', votes: 4,  status: 'assigned',  time: '09:58', assignee: 'Equipo B' },
    { id: 'R-2845', type: 'alumbrado',title: 'Lámpara fundida',                    location: 'Parque Hidalgo',         severity: 'low',    votes: 2,  status: 'pending',   time: '09:41', assignee: '—' },
    { id: 'R-2844', type: 'agua',     title: 'Fuga de agua en banqueta',           location: 'Av. Juárez 22',          severity: 'high',   votes: 12, status: 'confirmed', time: '09:22', assignee: 'Equipo A' },
    { id: 'R-2843', type: 'drenaje',  title: 'Coladera tapada',                   location: 'Calle Allende',          severity: 'low',    votes: 1,  status: 'resolved',  time: 'ayer',  assignee: 'Equipo C' },
    { id: 'R-2842', type: 'grafiti',  title: 'Grafiti en barda escolar',           location: 'Calle Hidalgo 88',       severity: 'low',    votes: 3,  status: 'pending',   time: 'ayer',  assignee: '—' },
    { id: 'R-2841', type: 'bache',    title: 'Pavimento hundido en cruce',         location: 'Av. Insurgentes 40',     severity: 'high',   votes: 9,  status: 'resolved',  time: 'lun',   assignee: 'Equipo B' },
  ];

  const navItems = [
    { l: 'Panel',      i: 'M3 12 12 3l9 9M5 10v10h14V10' },
    { l: 'Reportes',   i: 'M4 6h16M4 12h16M4 18h10' },
    { l: 'Mapa',       i: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z' },
    { l: 'Categorías', i: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
    { l: 'Usuarios',   i: 'M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 22c0-4 4-6 8-6s8 2 8 6' },
    { l: 'Ajustes',    i: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  ];

  const typeColor = { bache:'#7c3aed', agua:'#0ea5e9', basura:'#65a30d', alumbrado:'#eab308', drenaje:'#0891b2', grafiti:'#db2777' };
  const typeLabel = { bache:'Bache', agua:'Fuga agua', basura:'Basura', alumbrado:'Alumbrado', drenaje:'Drenaje', grafiti:'Grafiti' };

  // ─── Views ───────────────────────────────────────────────────
  const ViewPanel = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1, textTransform: 'uppercase' }}>Panel · Ayuntamiento</div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>Hoy en la ciudad</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, border: `1px solid ${border}`, background: card, fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={sub} strokeWidth="1.8"/><path d="m20 20-4-4" stroke={sub} strokeWidth="1.8" strokeLinecap="round"/></svg>
            <span style={{ color: sub }}>Buscar ID, calle…</span>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: '#0f1e3d', color: '#f59e0b', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Exportar CSV</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { l: 'Hoy', v: '47', d: '+12 vs ayer', c: '#f59e0b' },
          { l: 'Activos', v: '23', d: '3 urgentes', c: '#ef4444' },
          { l: 'Resueltos (7d)', v: '124', d: '89% < 24h', c: '#22c55e' },
          { l: 'Tiempo promedio', v: '2.1h', d: '-18 min', c: '#2563eb' },
        ].map((k, i) => (
          <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.08, textTransform: 'uppercase' }}>{k.l}</div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1.1, color: k.c, marginTop: 6 }}>{k.v}</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>{k.d}</div>
          </div>
        ))}
      </div>

      {/* Charts + Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.08 }}>Últimos 7 días</div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1.1, marginTop: 3 }}>Reportes por día</div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <span style={{ color: sub, display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#0f1e3d' }}/>Recibidos</span>
              <span style={{ color: sub, display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b' }}/>Resueltos</span>
            </div>
          </div>
          <svg width="100%" height="160" viewBox="0 0 560 160">
            {[...Array(5)].map((_, i) => <line key={i} x1="0" y1={20+i*30} x2="560" y2={20+i*30} stroke={border} strokeDasharray="3 4"/>)}
            {['L','M','M','J','V','S','D'].map((d, i) => {
              const x = 40 + i*75;
              const h1 = [80,95,70,110,120,60,90][i];
              const h2 = [60,75,55,85,100,50,80][i];
              return <g key={i}>
                <rect x={x} y={150-h1} width="22" height={h1} rx="3" fill="#0f1e3d"/>
                <rect x={x+26} y={150-h2} width="22" height={h2} rx="3" fill="#f59e0b"/>
                <text x={x+24} y="158" textAnchor="middle" fontSize="10" fill={sub}>{d}</text>
              </g>;
            })}
          </svg>
        </div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>En vivo</div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22 }}>Mapa de reportes</div>
            </div>
            <button onClick={() => setActiveNav('Mapa')} style={{ background: 'none', border: 'none', fontSize: 11, color: '#d97706', fontWeight: 600, cursor: 'pointer' }}>Ver mapa completo →</button>
          </div>
          <div style={{ flex: 1, minHeight: 200 }}>
            <MapCanvas dark={dark} pins={[{x:75,y:168,severity:'high',pulse:true},{x:160,y:185,severity:'medium'},{x:300,y:155,severity:'low'},{x:105,y:315,severity:'high'},{x:310,y:340,severity:'medium'}]}/>
          </div>
        </div>
      </div>

      {/* Table */}
      <ReportesTable reports={reports.slice(0,5)} card={card} border={border} sub={sub} text={text} typeColor={typeColor} typeLabel={typeLabel} onViewAll={() => setActiveNav('Reportes')}/>
    </>
  );

  const ViewReportes = () => {
    const [filter, setFilter] = React.useState('Todos');
    const filters = ['Todos','Urgentes','Sin asignar','Resueltos'];
    const filtered = reports.filter(r => {
      if (filter === 'Urgentes') return r.severity === 'high';
      if (filter === 'Sin asignar') return r.assignee === '—';
      if (filter === 'Resueltos') return r.status === 'resolved';
      return true;
    });
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Gestión</div>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>Todos los reportes</h1>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 10, background: '#0f1e3d', color: '#f59e0b', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Nuevo manual</button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? '#0f1e3d' : card,
              color: filter === f ? '#f59e0b' : sub,
              border: filter === f ? 'none' : `1px solid ${border}`,
            }}>{f}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: sub, alignSelf: 'center' }}>{filtered.length} resultados</span>
        </div>
        <ReportesTable reports={filtered} card={card} border={border} sub={sub} text={text} typeColor={typeColor} typeLabel={typeLabel}/>
      </>
    );
  };

  const ViewMapa = () => (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>En vivo</div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>Mapa de la ciudad</h1>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[{l:'Todo',a:true},{l:'Alto',c:'#ef4444'},{l:'Medio',c:'#f59e0b'},{l:'Bajo',c:'#22c55e'},{l:'Hoy'},{l:'Esta semana'}].map((f,i)=>(
          <span key={i} style={{padding:'6px 12px',borderRadius:999,fontSize:12,fontWeight:600,background:f.a?'#0f1e3d':card,color:f.a?'#f59e0b':(f.c||sub),border:f.a?'none':`1px solid ${border}`,display:'inline-flex',alignItems:'center',gap:6}}>
            {f.c&&!f.a&&<span style={{width:7,height:7,borderRadius:99,background:f.c}}/>}{f.l}
          </span>
        ))}
      </div>
      <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${border}`, height: 460 }}>
        <MapCanvas dark={dark} pins={[
          {x:75, y:120,severity:'high',pulse:true},{x:160,y:150,severity:'medium'},{x:300,y:100,severity:'low'},
          {x:105,y:280,severity:'high'},{x:310,y:300,severity:'medium'},{x:200,y:380,severity:'low'},
          {x:260,y:200,severity:'medium'},{x:340,y:430,severity:'high',pulse:true},
        ]}/>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
        {[{l:'Alto',n:3,c:'#ef4444'},{l:'Medio',n:3,c:'#f59e0b'},{l:'Bajo',n:2,c:'#22c55e'}].map((s,i)=>(
          <div key={i} style={{flex:1,background:card,border:`1px solid ${border}`,borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
            <span style={{width:10,height:10,borderRadius:99,background:s.c}}/>
            <div>
              <div style={{fontSize:11,color:sub}}>Severidad {s.l}</div>
              <div style={{fontFamily:'Instrument Serif, serif',fontSize:24,color:s.c}}>{s.n} reportes</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const ViewCategorias = () => {
    const cats = [
      {type:'bache',    label:'Baches',     total:18, open:8,  resolved:10, avg:'3.2h'},
      {type:'basura',   label:'Basura',      total:12, open:5,  resolved:7,  avg:'1.8h'},
      {type:'alumbrado',label:'Alumbrado',   total:9,  open:4,  resolved:5,  avg:'5.1h'},
      {type:'agua',     label:'Fuga agua',   total:6,  open:4,  resolved:2,  avg:'2.4h'},
      {type:'drenaje',  label:'Drenaje',     total:4,  open:2,  resolved:2,  avg:'4.0h'},
      {type:'grafiti',  label:'Grafiti',     total:3,  open:2,  resolved:1,  avg:'8.5h'},
    ];
    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Distribución</div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>Categorías</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {cats.map((c, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${typeColor[c.type]}15`, color: typeColor[c.type], display: 'grid', placeItems: 'center' }}>
                  <CategoryIcon type={c.type} size={20}/>
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20 }}>{c.label}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div><div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: typeColor[c.type] }}>{c.total}</div><div style={{ fontSize: 11, color: sub }}>Total</div></div>
                <div><div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: '#ef4444' }}>{c.open}</div><div style={{ fontSize: 11, color: sub }}>Abiertos</div></div>
                <div><div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: '#22c55e' }}>{c.resolved}</div><div style={{ fontSize: 11, color: sub }}>Resueltos</div></div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 5, borderRadius: 3, background: border, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${Math.round(c.resolved/c.total*100)}%`, background: '#22c55e', borderRadius: 3 }}/>
              </div>
              <div style={{ fontSize: 11, color: sub, display: 'flex', justifyContent: 'space-between' }}>
                <span>{Math.round(c.resolved/c.total*100)}% resuelto</span>
                <span>Prom. {c.avg}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const ViewUsuarios = () => (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Anónimos</div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>Usuarios</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[{l:'Reportantes únicos (7d)',v:'342',c:'#f59e0b'},{l:'Con +3 reportes',v:'47',c:'#2563eb'},{l:'Promedio votos/reporte',v:'4.2',c:'#22c55e'}].map((k,i)=>(
          <div key={i} style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:'14px 16px'}}>
            <div style={{fontSize:11,color:sub,fontFamily:'JetBrains Mono, monospace',textTransform:'uppercase'}}>{k.l}</div>
            <div style={{fontFamily:'Instrument Serif, serif',fontSize:36,color:k.c,marginTop:6}}>{k.v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 14 }}>Política de privacidad activa</div>
        {[
          'Los IDs de usuario son tokens aleatorios regenerables sin relación a datos personales.',
          'No se almacenan metadatos EXIF en las fotografías adjuntas a los reportes.',
          'Los reportes no registran IP de origen ni huella de dispositivo.',
          'El historial local puede borrarse desde la app en cualquier momento.',
          'Los datos se conservan máximo 180 días desde la resolución del reporte.',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: i > 0 ? `1px solid ${border}` : 'none' }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: '#22c55e15', color: '#22c55e', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 13, color: text, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </>
  );

  const ViewAjustes = () => (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Sistema</div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1, margin: '4px 0 0', letterSpacing: '-0.01em' }}>Ajustes</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { title: 'Notificaciones', items: ['Alertas de reportes urgentes','Email diario de resumen','Slack al asignar cuadrilla','SMS al resolver reporte'] },
          { title: 'Equipo', items: ['Equipo A · 4 miembros activos','Equipo B · 3 miembros activos','Equipo C · 2 miembros activos','+ Agregar equipo'] },
          { title: 'Exportación', items: ['CSV automático cada lunes','PDF de reporte mensual','API REST activada (v2)','Webhook Slack configurado'] },
          { title: 'Acceso', items: ['2 administradores activos','4 operadores activos','Autenticación institucional SSO','Logs de acceso: 90 días'] },
        ].map((sec, si) => (
          <div key={si} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, marginBottom: 14 }}>{sec.title}</div>
            {sec.items.map((item, ii) => (
              <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: ii > 0 ? `1px solid ${border}` : 'none' }}>
                <span style={{ flex: 1, fontSize: 13, color: text }}>{item}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m9 5 7 7-7 7" stroke={sub} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  const views = { Panel: ViewPanel, Reportes: ViewReportes, Mapa: ViewMapa, Categorías: ViewCategorias, Usuarios: ViewUsuarios, Ajustes: ViewAjustes };
  const ActiveView = views[activeNav] || ViewPanel;

  return (
    <div style={{ background: bg, color: text, height: '100%', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: card, borderRight: `1px solid ${border}`, padding: '20px 14px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '0 4px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#0f1e3d', display: 'grid', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, lineHeight: 1 }}>ReporteCiudad</div>
            <div style={{ fontSize: 10, color: sub, letterSpacing: 0.08, textTransform: 'uppercase', marginTop: 2 }}>Admin</div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((it) => {
            const active = activeNav === it.l;
            return (
              <button key={it.l} onClick={() => setActiveNav(it.l)} style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 9, marginBottom: 2,
                background: active ? '#0f1e3d' : 'transparent',
                color: active ? '#f59e0b' : sub,
                fontSize: 13, fontWeight: active ? 600 : 500,
                border: 'none', cursor: 'pointer',
                transition: 'background .15s, color .15s',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d={it.i} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {it.l}
              </button>
            );
          })}
        </nav>

        {/* Bottom user badge */}
        <div style={{ padding: '10px 10px', borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0f1e3d15', display: 'grid', placeItems: 'center', color: sub }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: text, lineHeight: 1 }}>Admin</div>
            <div style={{ fontSize: 10, color: sub, marginTop: 1 }}>ayuntamiento.gob.mx</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px' }}>
        <ActiveView/>
      </div>
    </div>
  );
}

// Shared table component
function ReportesTable({ reports, card, border, sub, text, typeColor, typeLabel, onViewAll }) {
  return (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${border}` }}>
        <div>
          <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Cola de atención</div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22 }}>Reportes recientes</div>
        </div>
        {onViewAll && (
          <button onClick={onViewAll} style={{ background: 'none', border: 'none', fontSize: 11, color: '#d97706', fontWeight: 600, cursor: 'pointer' }}>Ver todos →</button>
        )}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(15,30,61,0.03)' }}>
            {['ID','Tipo','Descripción','Ubicación','Severidad','Votos','Estado','Hora'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 600, color: sub, textTransform: 'uppercase', letterSpacing: 0.08, fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${border}` }}>
              <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: text, fontWeight: 500 }}>{r.id}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: typeColor[r.type], fontWeight: 600 }}>
                  <CategoryIcon type={r.type} size={14}/>
                  {typeLabel[r.type]}
                </span>
              </td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: text, fontWeight: 500 }}>{r.title}</td>
              <td style={{ padding: '12px 16px', fontSize: 12, color: sub }}>{r.location}</td>
              <td style={{ padding: '12px 16px' }}><SeverityChip level={r.severity}/></td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: text, fontWeight: 600 }}>{r.votes}</td>
              <td style={{ padding: '12px 16px' }}><StatusPill status={r.status}/></td>
              <td style={{ padding: '12px 16px', fontSize: 12, color: sub }}>{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { AdminDashboard });
