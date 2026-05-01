// screens-mobile-2.jsx — Report flow, detail, feed, mine, notifications, profile
/* global React, CategoryIcon, SeverityChip, StatusPill, AnonBadge, PhotoPlaceholder, TabBar, ReportRow, MapCanvas */

// ───────────────────────── Report Flow (multi-step) ─────────────────────────
function StepDots({ step, total, dark }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          height: 4, flex: i === step ? 3 : 1, borderRadius: 2,
          background: i <= step ? '#f59e0b' : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(15,30,61,0.1)'),
          transition: 'all .3s',
        }}/>
      ))}
    </div>
  );
}

function ReportStep1({ dark, onNext, selected, setSelected }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const types = [
    { id: 'bache', label: 'Bache', desc: 'Hoyo, pavimento roto', color: '#7c3aed' },
    { id: 'basura', label: 'Basura', desc: 'Acumulación, no recolectada', color: '#65a30d' },
    { id: 'alumbrado', label: 'Alumbrado', desc: 'Lámpara fundida o dañada', color: '#eab308' },
    { id: 'agua', label: 'Fuga de agua', desc: 'Drenaje, tubería rota', color: '#0ea5e9' },
  ];

  return (
    <>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, lineHeight: 1.05, color: text, marginBottom: 6, letterSpacing: '-0.01em' }}>
        ¿Qué encontraste?
      </div>
      <div style={{ fontSize: 14, color: sub, marginBottom: 24 }}>
        Elige la categoría que mejor describe la situación.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {types.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)} style={{
            border: selected === t.id ? `2px solid ${t.color}` : `1px solid ${border}`,
            background: selected === t.id ? `${t.color}10` : card,
            borderRadius: 16, padding: '18px 14px',
            textAlign: 'left', cursor: 'pointer', position: 'relative',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, marginBottom: 12,
              background: `${t.color}18`, color: t.color,
              display: 'grid', placeItems: 'center',
            }}>
              <CategoryIcon type={t.id} size={22} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 3 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: sub, lineHeight: 1.35 }}>{t.desc}</div>
            {selected === t.id && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 20, height: 20, borderRadius: 99, background: t.color,
                display: 'grid', placeItems: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 10-11" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <button style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px', borderRadius: 12,
        background: 'transparent', border: `1px dashed ${border}`,
        color: sub, fontSize: 13, fontWeight: 500, cursor: 'pointer',
        marginBottom: 20,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        Otro tipo de riesgo
      </button>

      <button disabled={!selected} onClick={onNext} style={{
        width: '100%', height: 52, borderRadius: 14, border: 'none',
        background: selected ? '#0f1e3d' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,30,61,0.1)'),
        color: selected ? '#f59e0b' : sub,
        fontSize: 15, fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Continuar
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </>
  );
}

function ReportStep2({ dark, onNext, onBack, severity, setSeverity, notes, setNotes }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';

  const severities = [
    { id: 'low', label: 'Bajo', desc: 'Molestia menor', color: '#22c55e' },
    { id: 'medium', label: 'Medio', desc: 'Problema evidente', color: '#f59e0b' },
    { id: 'high', label: 'Alto', desc: 'Riesgo inminente', color: '#ef4444' },
  ];

  return (
    <>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, lineHeight: 1.05, color: text, marginBottom: 6 }}>
        Cuéntanos más.
      </div>
      <div style={{ fontSize: 14, color: sub, marginBottom: 20 }}>
        Tu descripción ayuda al equipo a priorizar.
      </div>

      <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
        Severidad
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {severities.map(s => (
          <button key={s.id} onClick={() => setSeverity(s.id)} style={{
            flex: 1, padding: '12px 8px', borderRadius: 12,
            border: severity === s.id ? `2px solid ${s.color}` : `1px solid ${border}`,
            background: severity === s.id ? `${s.color}12` : card,
            cursor: 'pointer', textAlign: 'center',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 99, background: s.color, margin: '0 auto 8px' }}/>
            <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{s.label}</div>
            <div style={{ fontSize: 10, color: sub, marginTop: 2 }}>{s.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.08, textTransform: 'uppercase', marginBottom: 8 }}>
        Descripción <span style={{ color: sub, textTransform: 'none', fontFamily: 'Inter' }}>(opcional)</span>
      </div>
      <div style={{
        background: card, border: `1px solid ${border}`, borderRadius: 14,
        padding: '12px 14px', marginBottom: 16,
      }}>
        <div style={{ color: text, fontSize: 14, minHeight: 64, lineHeight: 1.45 }}>
          {notes || <span style={{ color: sub }}>Ej. "Bache de unos 40 cm sobre el carril derecho, ya dañó dos autos esta semana."</span>}
          <span style={{ color: '#f59e0b' }}>|</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 8, borderTop: `1px solid ${border}`,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ border: 'none', background: 'transparent', color: sub, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 1v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Mic
            </button>
          </div>
          <span style={{ fontSize: 10, color: sub }}>0 / 240</span>
        </div>
      </div>

      {/* Quick tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Daña autos', 'Zona de paso', 'Zona escolar', 'Peligroso de noche', 'Desde hace días'].map(t => (

          <span key={t} style={{
            padding: '5px 10px', borderRadius: 999,
            background: card, border: `1px solid ${border}`,
            fontSize: 11, color: sub, fontWeight: 500,
          }}>+ {t}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 52, height: 52, borderRadius: 14,
          background: card, border: `1px solid ${border}`,
          display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m6-6-6 6 6 6" stroke={text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={onNext} style={{
          flex: 1, height: 52, borderRadius: 14, border: 'none',
          background: '#0f1e3d', color: '#f59e0b',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>Continuar</button>
      </div>
    </>
  );
}

function ReportStep3({ dark, onNext, onBack }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';
  const [hasPhoto, setHasPhoto] = React.useState(true);
  return (
    <>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, lineHeight: 1.05, color: text, marginBottom: 6 }}>
        Foto y ubicación.
      </div>
      <div style={{ fontSize: 14, color: sub, marginBottom: 20 }}>
        Una foto vale más — y ayuda a confirmar el reporte.
      </div>

      {/* Photo area */}
      {hasPhoto ? (
        <div style={{
          position: 'relative', borderRadius: 16, overflow: 'hidden',
          marginBottom: 12, border: `1px solid ${border}`,
        }}>
          <PhotoPlaceholder height={200} label="foto del bache" radius={0} />
          <div style={{
            position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6,
          }}>
            <button style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(0,0,0,0.6)', border: 'none',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(15,30,61,0.9)',
            fontSize: 11, color: '#f59e0b', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="2"/></svg>
            Metadatos removidos
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setHasPhoto(true)} style={{
            height: 108, borderRadius: 16, border: `1px dashed ${border}`,
            background: card, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            color: sub, fontSize: 12, cursor: 'pointer', fontWeight: 500,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M9 6 10 4h4l1 2" stroke="currentColor" strokeWidth="1.7"/></svg>
            Tomar foto
          </button>
          <button style={{
            height: 108, borderRadius: 16, border: `1px dashed ${border}`,
            background: card, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            color: sub, fontSize: 12, cursor: 'pointer', fontWeight: 500,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.7"/><path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
            De galería
          </button>
        </div>
      )}

      {/* Location */}
      <div style={{
        background: card, border: `1px solid ${border}`, borderRadius: 16,
        padding: 12, marginBottom: 20, display: 'flex', gap: 12,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
        }}>
          <MapCanvas dark={dark} pins={[{ x: 200, y: 250, severity: 'medium', pulse: true }]} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>Ubicación detectada</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: text, marginTop: 3 }}>Av. Reforma 240</div>
          <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>Col. Centro · 80m de ti</div>
          <button style={{
            marginTop: 8, background: 'transparent', border: 'none',
            color: '#d97706', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            padding: 0,
          }}>Ajustar en el mapa →</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 52, height: 52, borderRadius: 14,
          background: card, border: `1px solid ${border}`,
          display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m6-6-6 6 6 6" stroke={text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={onNext} style={{
          flex: 1, height: 52, borderRadius: 14, border: 'none',
          background: '#0f1e3d', color: '#f59e0b',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Revisar y enviar
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </>
  );
}

function ReportSuccess({ dark, onClose }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';
  const card = dark ? '#141c33' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'var(--line)';
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '80px 24px 32px', textAlign: 'center',
      background: dark ? '#0a1224' : '#faf7f2',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 32,
          background: 'radial-gradient(circle, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
          display: 'grid', placeItems: 'center', marginBottom: 24,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: '#0f1e3d', display: 'grid', placeItems: 'center',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 10-11" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 34, lineHeight: 1, color: text, marginBottom: 10 }}>
          Gracias. Listo.
        </div>
        <p style={{ fontSize: 15, color: sub, maxWidth: 280, lineHeight: 1.45, margin: '0 auto 20px' }}>
          Tu reporte llegó al equipo de mantenimiento. Recibirás avisos si cambia de estado.
        </p>
        <div style={{
          background: card, border: `1px solid ${border}`,
          borderRadius: 14, padding: '10px 16px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: text,
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: sub, fontSize: 10 }}>ID</span>
          #R-2847
          <span style={{ color: sub }}>·</span>
          <AnonBadge compact/>
        </div>
      </div>
      <button onClick={onClose} style={{
        height: 52, borderRadius: 14, border: 'none',
        background: '#0f1e3d', color: '#f59e0b',
        fontSize: 15, fontWeight: 600, cursor: 'pointer',
      }}>Volver al mapa</button>
      <button style={{
        background: 'transparent', border: 'none', color: sub,
        marginTop: 12, fontSize: 13, cursor: 'pointer', fontWeight: 500,
      }}>Ver mi reporte →</button>
    </div>
  );
}

function ScreenReportFlow({ dark, step, setStep, selected, setSelected, severity, setSeverity, notes, setNotes, onClose }) {
  const text = dark ? '#faf7f2' : '#0a1530';
  const sub = dark ? 'rgba(255,255,255,0.55)' : '#5b6478';

  if (step === 3) return <ReportSuccess dark={dark} onClose={onClose} />;

  return (
    <div style={{
      height: '100%', background: dark ? '#0a1224' : '#faf7f2',
      padding: '56px 20px 30px', display: 'flex', flexDirection: 'column',
      color: text,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: sub,
          fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1,
        }}>×</button>
        <span style={{
          fontSize: 11, color: sub, fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: 0.1, textTransform: 'uppercase',
        }}>Paso {step + 1} de 3</span>
        <AnonBadge compact/>
      </div>
      <div style={{ marginBottom: 22 }}>
        <StepDots step={step} total={3} dark={dark}/>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {step === 0 && <ReportStep1 dark={dark} onNext={() => setStep(1)} selected={selected} setSelected={setSelected}/>}
        {step === 1 && <ReportStep2 dark={dark} onNext={() => setStep(2)} onBack={() => setStep(0)} severity={severity} setSeverity={setSeverity} notes={notes} setNotes={setNotes}/>}
        {step === 2 && <ReportStep3 dark={dark} onNext={() => setStep(3)} onBack={() => setStep(1)}/>}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenReportFlow, StepDots });
