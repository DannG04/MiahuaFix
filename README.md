# MiahuaFix 📍

**MiahuaFix** es una solución integral para la gestión de incidencias urbanas en Miahuatlán. Su objetivo es cerrar la brecha de comunicación entre el ciudadano y la administración pública, permitiendo reportar problemas de **baches, luminarias y basura** mediante tecnología móvil.

> Aplicación construida con [Expo](https://expo.dev) + React Native, respaldada por [Supabase](https://supabase.com) como backend.

---

## 🎯 Visión del Proyecto

El proyecto se rige por el principio de **"No dejar a nadie atrás"**: la app debe ser usable por personas de todas las edades y capacidades, incluyendo adultos mayores o personas con discapacidades visuales o motrices leves.

Consulta la [Especificación de Requisitos de Software (ERS)](./docs/ERS.md) para conocer el detalle completo de los requisitos funcionales, no funcionales y los principios de accesibilidad.

---

## ✨ Características principales

- 📍 **Captura geográfica automática** — latitud y longitud vía GPS al iniciar un reporte.
- 📷 **Evidencia visual** — fotografía en tiempo real o desde la galería.
- 🗂️ **Categorización** — selección del tipo de incidencia (Bache, Luminaria, Basura).
- ☁️ **Sincronización con Supabase** — datos en la base y fotos en Storage.
- 🗺️ **Mapa de incidencias** — visualización interactiva de reportes cercanos.
- ♿ **Accesibilidad WCAG AA** — alto contraste, fuentes dinámicas y compatibilidad con TalkBack/VoiceOver.

---

## 🛠️ Stack Tecnológico

- **Framework:** Expo (~54) + React Native (0.81)
- **Routing:** expo-router (file-based)
- **Mapas:** react-native-maps
- **Cámara y ubicación:** expo-camera, expo-image-picker, expo-location
- **Backend:** Supabase (PostgreSQL + Storage + RLS)
- **Lenguaje:** TypeScript

---

## 🚀 Empezar

1. Instala las dependencias

   ```bash
   npm install
   ```

2. Inicia la app

   ```bash
   npx expo start
   ```

En la salida encontrarás opciones para abrir la app en:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador de Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador de iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

Puedes empezar a desarrollar editando los archivos dentro del directorio **app**. Este proyecto usa [file-based routing](https://docs.expo.dev/router/introduction).

---

## 📁 Estructura del Proyecto

```
MiahuaFix/
├── app/           # Pantallas y rutas (file-based routing)
├── assets/        # Imágenes, fuentes e íconos
└── docs/          # Documentación del proyecto
    └── ERS.md     # Especificación de Requisitos de Software
```

---

## 📋 Requisitos clave

| Tipo | ID | Resumen |
|------|----|---------|
| Funcional | RF-01 | Captura geográfica vía GPS |
| Funcional | RF-02 | Evidencia visual (cámara/galería) |
| Funcional | RF-03 | Categorización de incidencia |
| Funcional | RF-04 | Sincronización con Supabase + Storage |
| Funcional | RF-05 | Mapa de incidencias |
| No Funcional | RNF-01 | Envío < 5s en redes 4G |
| No Funcional | RNF-02 | Uptime 99.9% |
| No Funcional | RNF-03 | Fidelidad visual con mockups |
| No Funcional | RNF-04 | Row Level Security (RLS) en Supabase |

Detalles completos en [`docs/ERS.md`](./docs/ERS.md).

---

## 📚 Aprende más

- [Documentación de Expo](https://docs.expo.dev/)
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de accesibilidad en React Native](https://reactnative.dev/docs/accessibility)
