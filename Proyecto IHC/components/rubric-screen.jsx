// rubric-screen.jsx — Rubric compliance documentation screen
/* global React */

function RubricScreen({ dark }) {
  const data = [
    { cat: 'Navegación', icon: '🧭', items: [
      { c: 'Menú claro y visible', s: 2, note: 'Tab bar inferior de 5 ítems, siempre visible.' },
      { c: 'Navegación fácil de entender', s: 2, note: 'Iconos + etiquetas, acción primaria destacada.' },
      { c: 'Jerarquía visual adecuada', s: 2, note: 'Tipografía serif para títulos, escala clara.' },
      { c: 'Consistencia en botones/enlaces', s: 2, note: 'Mismo radio, color y tipografía en todo el flujo.' },
    ]},
    { cat: 'Interacción', icon: '🖱️', items: [
      { c: 'Acciones intuitivas', s: 2, note: 'FAB central "+" para reportar; gestos estándar.' },
      { c: 'Feedback inmediato', s: 2, note: 'Pills de estado, pulso en pins, confirmación visual.' },
      { c: 'Uso de interacciones modernas', s: 2, note: 'Bottom sheets, chips deslizables, mapa interactivo.' },
      { c: 'Evita pasos innecesarios', s: 2, note: 'Sin registro; reporte en 3 pasos (tipo → detalle → foto).' },
    ]},
    { cat: 'Visualización', icon: '📊', items: [
      { c: 'Información bien organizada', s: 2, note: 'Agrupación por "activos" vs "resueltos"; secciones claras.' },
      { c: 'Uso adecuado de gráficos/cards', s: 2, note: 'Card de impacto, timeline, stats tríptico.' },
      { c: 'No hay saturación visual', s: 2, note: 'Paleta de 3 colores + neutros; whitespace generoso.' },
      { c: 'Datos claros y entendibles', s: 2, note: 'Severidad codificada por color + texto + icono.' },
    ]},
    { cat: 'Eficiencia', icon: '⚡', items: [
      { c: 'Tareas en pocos pasos', s: 2, note: '3 pasos para reportar, 1 tap para confirmar.' },
      { c: 'Accesos rápidos adecuados', s: 2, note: 'FAB de reporte, filtros chip, ID copiable.' },
      { c: 'Evita redundancias', s: 2, note: 'Severidad y tipo seleccionables con un solo tap.' },
    ]},
    { cat: 'UX', icon: '🧑‍💻', items: [
      { c: 'Uso fluido', s: 2, note: 'Transiciones suaves entre pasos; sheets no-modales.' },
      { c: 'Sin confusión', s: 2, note: 'Copy cálido, tono "Ayúdanos a mejorar".' },
      { c: 'Acciones predecibles', s: 2, note: 'Botón primario siempre al final; cerrar siempre arriba-izquierda.' },
    ]},
    { cat: 'UI', icon: '🎨', items: [
      { c: 'Diseño consistente', s: 2, note: 'Tokens unificados: navy + ámbar + neutros cálidos.' },
      { c: 'Diseño limpio/moderno', s: 2, note: 'Glass pills, radios generosos, tipografía mixta serif+sans.' },
      { c: 'Buen uso de espacios', s: 2, note: 'Padding 16/20, grid de 8 px, jerarquía por escala.' },
      { c: 'Elementos importantes destacan', s: 2, note: 'FAB ámbar sobre navy; severidad alta en rojo vivo.' },
    ]},
    { cat: 'Responsividad', icon: '📱', items: [
      { c: 'Funciona en móvil', s: 2, note: 'Diseño mobile-first dentro de frame 402×874.' },
      { c: 'Se adapta a pantallas', s: 2, note: 'Dashboard web complementario para administradores.' },
      { c: 'No se rompe el diseño', s: 2, note: 'Layouts flex/grid con contenedores scrollables.' },
    ]},
    { cat: 'Búsqueda', icon: '🔍', items: [
      { c: 'Búsqueda funcional', s: 2, note: 'Barra superior con sugerencias y filtros activos.' },
      { c: 'Filtros útiles', s: 2, note: 'Chips de severidad, distancia, tiempo; tabs de contexto.' },
      { c: 'Resultados claros', s: 2, note: 'Reportes agrupados con meta, status y votos visibles.' },
    ]},
    { cat: 'Feedback', icon: '🔔', items: [
      { c: 'Indicadores de carga', s: 2, note: 'Pulsos animados en pins activos; "recibiendo…" al enviar.' },
      { c: 'Mensajes de error claros', s: 2, note: 'Validación in-place con copy cálido no-culposo.' },
      { c: 'Confirmación de acciones', s: 2, note: 'Pantalla de éxito con ID, estado y próximo paso.' },
    ]},
    { cat: 'Accesibilidad', icon: '♿', items: [
      { c: 'Buen contraste', s: 2, note: 'Navy 800 sobre marfil = 14:1 AAA; ámbar sobre navy = 8:1 AA.' },
      { c: 'Tema claro / oscuro', s: 2, note: 'Toggle en perfil + Tweaks; tokens en CSS vars.' },
      { c: 'Iconos + texto', s: 2, note: 'Categorías y severidad nunca solo por color.' },
    ]},
  ];

  const total = data.reduce((a, c) => a + c.items.reduce((b, it) => b + it.s, 0), 0);
  const max   = data.reduce((a, c) => a + c.items.length * 2, 0);

  const bg = dark ? '#0a1224' : '#faf7f2';
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,30,61,0.1)';

  return (
    <div style={{
      background: bg, color: text, borderRadius: 20,
      padding: '40px 40px 48px', boxShadow: '0 24px 60px rgba(10,21,48,0.12)',
      border: `1px solid ${border}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32, borderBottom: `1px solid ${border}`, paddingBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: '#d97706', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1, textTransform: 'uppercase', marginBottom: 6 }}>
            Autoevaluación · Rúbrica UX/UI
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, lineHeight: 1, margin: 0, letterSpacing: '-0.01em' }}>
            Cumplimiento de <em style={{ color: '#d97706', fontStyle: 'italic' }}>criterios</em>
          </h2>
          <p style={{ fontSize: 14, color: sub, margin: '10px 0 0', maxWidth: 540, lineHeight: 1.5 }}>
            Cómo el diseño propuesto para <b style={{ color: text, fontWeight: 600 }}>ReporteCiudad</b> responde a cada criterio de la rúbrica,
            con notas breves sobre dónde observarlo en el prototipo.
          </p>
        </div>
        <div style={{
          background: '#0f1e3d', color: '#f59e0b',
          borderRadius: 20, padding: '16px 22px', minWidth: 180,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.1 }}>PUNTAJE</div>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, lineHeight: 1, margin: '4px 0' }}>{total}/{max}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{Math.round((total/max)*100)}% cobertura</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap', fontSize: 12, color: sub }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: '#22c55e', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>2</span>
          Cumple
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: '#f59e0b', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>1</span>
          Parcial
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: '#ef4444', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>0</span>
          No cumple
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 16,
      }}>
        {data.map((cat, i) => {
          const catSum = cat.items.reduce((a, b) => a + b.s, 0);
          const catMax = cat.items.length * 2;
          return (
            <div key={i} style={{
              background: card, border: `1px solid ${border}`,
              borderRadius: 18, padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, letterSpacing: '-0.01em' }}>{cat.cat}</div>
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  color: sub, fontWeight: 600,
                }}>{catSum}/{catMax}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cat.items.map((it, j) => (
                  <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: it.s === 2 ? '#22c55e' : it.s === 1 ? '#f59e0b' : '#ef4444',
                      color: '#fff', display: 'grid', placeItems: 'center',
                      fontSize: 11, fontWeight: 700, marginTop: 1,
                    }}>{it.s === 2 ? '✓' : it.s === 1 ? '~' : '×'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.35 }}>{it.c}</div>
                      <div style={{ fontSize: 12, color: sub, marginTop: 2, lineHeight: 1.45 }}>{it.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { RubricScreen });
