# Modo Buenaventura — Tracker

Web estática para GitHub Pages. No necesita servidor, base de datos ni API.

## Publicar en GitHub Pages

1. Crea un repositorio, por ejemplo `modo-buenaventura`.
2. Sube `index.html`, `styles.css` y `app.js` a la raíz.
3. En GitHub entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona `main` y carpeta `/ (root)`.
6. Guarda. GitHub generará la URL de Pages.

## Datos
Los registros se guardan únicamente en `localStorage` del navegador/dispositivo. Si borras los datos del navegador, se perderán.

## Alcance
Incluye:
- Dashboard diario.
- Calendario de los 28 días con puntuación orientativa.
- Fecha de inicio configurable para sincronizar la Fase 1.
- Registro de peso, agua y energía.
- Registro manual de alimentos.
- Presets con valores nutricionales estimados.
- Cálculo automático de kcal y macronutrientes.
- Consejos basados en el registro.
- Rutina diaria y marcación de ejercicios.
- Progresión de semanas 1–4.
- Historial local.
- Diseño responsive para celular.

Los objetivos y entrenamiento se basan en el PDF proporcionado del plan. El rango original de 1.500–1.700 kcal y el cardio de alta intensidad requieren prudencia; la app no sustituye valoración profesional.

- Exportación de los datos del navegador a JSON para respaldo.

## IA opcional
La versión Coach v4 puede conectarse directamente desde el navegador a Groq o Gemini.
- Se recomienda Groq para este proyecto por su API compatible con OpenAI.
- La app limita localmente a 10 consultas por día.
- La API key se guarda en localStorage del navegador. Para un sitio público esto significa que la clave queda expuesta al usuario que la configure; no uses una clave con permisos/billing sensibles.
- Para una aplicación pública real, conviene mover la llamada a una función serverless/proxy y nunca publicar una API key.
