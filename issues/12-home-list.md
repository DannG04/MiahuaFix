# 12 — Home: vista lista + filtros + búsqueda

**Fase:** 3 · Pantallas
**Dependencias:** 11
**Estimación:** 1.5 h

## Contexto
El toggle Mapa/Lista del header alterna a una `FlatList` de `<ReportRow>`. El prototipo lo muestra en `ScreenHome` (líneas 328–336): mismas chips de filtro, lista paddeada bajo el header.

## Tareas
- [ ] Estado local `view: 'map' | 'list'` (o segregar en dos sub-componentes).
- [ ] Cuando `view === 'list'`:
  - `<FlatList data={reportes}>` con `<ReportRow>`.
  - `contentContainerStyle={{ paddingTop: 240, paddingBottom: 110 }}` para que el header overlay no tape los primeros items.
  - Pull-to-refresh con `RefreshControl` que llame `refetch()`.
  - `ListEmptyComponent` con ilustración + "Sin reportes con estos filtros".
- [ ] Convertir el placeholder de búsqueda en `<TextInput>` real:
  - Debounce 300ms.
  - Filtrar por título/descripción/colonia (cliente, en lo que la lista cabe en memoria).
- [ ] Persistir filtros en `useState` global (Zustand o un contexto simple) para que sobrevivan al toggle vista.

## Criterios de aceptación
- Toggle conserva los filtros aplicados.
- Pull-to-refresh recarga.
- Búsqueda filtra mientras se escribe (con debounce).
- Tap en cualquier `<ReportRow>` navega al detalle.
