# Especificación de Requisitos de Software (ERS)

**Proyecto:** MiahuaFix
**Versión:** 1.0
**Estado:** Definición Inicial

---

Este documento de especificación de requisitos (ERS) servirá como la brújula para el desarrollo de MiahuaReporta. Está diseñado para ser un archivo vivo que guíe tanto el código como las pruebas de usuario, asegurando que el producto final sea fiel a tu visión y útil para la comunidad de Miahuatlán.

---

## 1. Introducción

MiahuaFix es una solución integral para la gestión de incidencias urbanas. Su objetivo es cerrar la brecha de comunicación entre el ciudadano y la administración pública, permitiendo reportar problemas de baches, luminarias y basura mediante tecnología móvil.

---

## 2. Requisito Estratégico: Accesibilidad Universal

Este proyecto se rige por el principio de **"No dejar a nadie atrás"**. La aplicación debe ser utilizable por personas de todas las edades y capacidades, incluyendo adultos mayores o personas con discapacidades visuales o motrices leves.

- **Contraste:** Uso de paletas de colores con alto contraste (cumplimiento WCAG AA).
- **Legibilidad:** Soporte para fuentes dinámicas (escalado de texto según la configuración del sistema).
- **Lectores de Pantalla:** Uso correcto de etiquetas `accessibilityLabel` en React Native para compatibilidad con TalkBack (Android) y VoiceOver (iOS).
- **Simplicidad:** Interfaces limpias con áreas de toque (botones) de al menos **44x44 dp** para facilitar la interacción.

---

## 3. Requisitos Funcionales (RF)

| ID    | Requisito             | Descripción                                                                                              |
|-------|-----------------------|----------------------------------------------------------------------------------------------------------|
| RF-01 | Captura Geográfica    | La app debe obtener automáticamente la latitud y longitud mediante el GPS al iniciar un reporte.         |
| RF-02 | Evidencia Visual      | El sistema debe permitir tomar una fotografía en tiempo real o seleccionar una de la galería.            |
| RF-03 | Categorización        | El usuario debe poder seleccionar el tipo de incidencia (Bache, Luminaria, Basura).                     |
| RF-04 | Sincronización        | Los datos deben enviarse a Supabase y la imagen debe alojarse en el Bucket de Storage.                  |
| RF-05 | Mapa de Incidencias   | Visualización interactiva de los reportes cercanos al usuario.                                           |

---

## 4. Requisitos No Funcionales (RNF)

| ID     | Requisito         | Descripción                                                                                      |
|--------|-------------------|--------------------------------------------------------------------------------------------------|
| RNF-01 | Desempeño         | El envío de un reporte no debe tardar más de 5 segundos en redes 4G.                            |
| RNF-02 | Disponibilidad    | Uso de arquitectura de Supabase para asegurar un uptime del 99.9%.                              |
| RNF-03 | Fidelidad Visual  | Se debe seguir estrictamente la estructura y flujo definido en los mockups ubicados en `/docs`. |
| RNF-04 | Seguridad         | Implementación de Row Level Security (RLS) para proteger la integridad de los datos.            |
