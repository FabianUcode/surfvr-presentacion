# SurfVR — Presentación Oficial & Arquitectura Interactiva

> **“Where you look is where you go.”** — Presentación técnica e interactiva de **SurfVR** (Sea Glass Edition).

## Descripción

Landing page de **presentación oficial y desglose técnico** del proyecto **SurfVR**, diseñada con el sistema visual **Sea Glass** y un motor de estado reactivo en JavaScript puro (`Proxy` store) sin dependencias externas.

### Secciones Interactivas

1. **Sesión Reactiva en Vivo**: Barra superior sincronizada con la playa seleccionada, condiciones del mar, tabla equipada, modalidad de entrada y billetera reactiva.
2. **Hidrodinámica Analítica & Ciclo de la Ola (`WaveSurface.cs`)**: Inspector interactivo de las 7 fases físicas de la ola (*Swell, Shoaling, Peak, Lip, Barrel, Peel, Whitewater*) y comparativa de manejo *Real vs. Arcade*.
3. **4 Modalidades de Juego**: *Free Surf*, *Hop Into The Beach* (con simulador interactivo de misiones del salvavidas Makoa), *Session Settings (Sandbox)* y *Replay & Cámara Dron*.
4. **5 Playas Legendarias**: *Teahupo'o, Pipeline, Nazaré, Chicama y Jeffreys Bay* con pronóstico en tiempo real y simulador de condiciones (*Very Poor* a *Epic*).
5. **Shaper's Showroom (7 Tablas)**: *Funboard, Softboard, Fish, Twin, Shortboard, Longboard y Gun* con compra reactiva y estadísticas *Ride Feel*.
6. **Personalización & Tiendas Locales**: Estudio de pintura SVG en vivo (*Fill, Rail, Fins* + controles HSV), editor de surfista y las 4 tiendas oficiales de playa.
7. **Galería Sea Glass & Descargas Multiplataforma**: Capturas a pantalla completa y enlaces configurables para Windows (`.exe`), macOS, iPhone VR y Android (`.apk`).

## Estructura del Proyecto

```text
surfvr-presentacion/
├── index.html          # Página principal de presentación técnica e interactiva
├── styles.css          # Sistema de diseño "Sea Glass"
├── app.js              # Motor reactivo y configuración de URLs de descarga
├── vercel.json         # Configuración lista para despliegue en Vercel
├── assets/
│   ├── beaches/        # Fotografías de las 5 playas reales
│   ├── fonts/          # Tipografía local Manrope (Medium, SemiBold, Bold, ExtraBold)
│   ├── logos/          # Emblemas oficiales de las 4 Surf Shops
│   └── screenshots/    # 13 capturas reales de interfaz y gameplay
└── downloads/          # Carpeta para instaladores directos (.exe / .apk)
```

## Despliegue en Vercel

Este repositorio está listo para importarse directamente en **Vercel** sin pasos de compilación (*Framework Preset: Other*, *Output Directory: `.`*).
