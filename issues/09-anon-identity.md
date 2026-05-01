# 09 — Identidad anónima persistente

**Fase:** 2 · Datos
**Dependencias:** 01
**Estimación:** 45 min

## Contexto
El prototipo es 100% anónimo: cada usuario tiene un ID corto tipo `#a7f9-3e2c` (ver `ScreenProfile`, línea ~432) que nunca se asocia a email/teléfono. Necesitamos generarlo, persistirlo y mandarlo en cada request.

## Tareas
- [ ] Crear `src/lib/anonId.ts`:
  - `getAnonId(): Promise<string>` — lee de `expo-secure-store` con clave `miahua.anon_id`. Si no existe, genera un UUID v4 (`crypto.randomUUID()` o `expo-crypto`), lo guarda y lo retorna.
  - `getAnonIdShort(): Promise<string>` — devuelve los primeros 9 chars formateados como `xxxx-xxxx` para mostrar en perfil.
  - `regenerateAnonId(): Promise<string>` — borra y vuelve a generar (botón "Regenerar mi ID anónimo" del perfil).
- [ ] Crear `src/hooks/useAnonId.ts` con cache en memoria:
  ```ts
  export function useAnonId() {
    const [id, setId] = useState<string | null>(null);
    useEffect(() => { getAnonId().then(setId); }, []);
    return { id, regenerate: async () => setId(await regenerateAnonId()) };
  }
  ```
- [ ] Inyectar `anon_id` en el header de Supabase (para usarlo en RLS):
  ```ts
  supabase.realtime.setAuth(...)
  // o usar headers globales
  ```
  Investigar la mejor forma; si no es trivial, pasarlo como columna explícita en cada `insert` (más simple, lo que asume la issue 07).
- [ ] Marcar el primer arranque para mostrar onboarding: clave `miahua.onboarded` en SecureStore.

## Criterios de aceptación
- Tras instalar la app, se genera un UUID y persiste entre cierres.
- "Regenerar mi ID" cambia el UUID y los reportes anteriores ya no aparecen en "Mis reportes".
- `getAnonIdShort()` retorna un formato legible tipo `a7f9-3e2c`.
