# CalidadCampo

Aplicación web para registrar inspecciones de calidad de fruta en campo y obtener
un dictamen inmediato y consistente.

🔗 **Aplicación:** https://aleonupc.github.io/calidad-campo/

## Caso de uso

### Contexto

En los fundos agrícolas, durante la cosecha, los inspectores de calidad toman
muestras de fruta por lote antes de enviarla a la planta de empaque. En cada
muestra cuentan los frutos con defectos (pudrición, partidura, golpe, bajo calibre,
quemadura de sol) y miden los °Brix para decidir si el lote cumple los criterios
de aceptación.

### Problema

El registro suele hacerse en formatos de papel u hojas de cálculo sueltas, y el
porcentaje de defectos se calcula a mano. Esto provoca errores de cálculo, criterios
de aceptación aplicados de forma distinta entre inspectores y un historial disperso
que dificulta identificar qué defectos se repiten más o comparar lotes.

### Usuario objetivo

Inspectores y supervisores de calidad que trabajan en fundos y lotes agrícolas.

### Objetivo

Estandarizar el registro de inspecciones y el dictamen de calidad, reduciendo
errores de cálculo y facilitando el seguimiento de los defectos.

### Solución propuesta

Una aplicación web que funciona en el navegador, sin instalación, donde el inspector
registra cada muestra y obtiene al instante el porcentaje de defectos y el dictamen
según umbrales fijos. Las inspecciones se guardan en el dispositivo y se resumen en
indicadores y un gráfico que muestra qué defectos predominan.

### Funcionalidades principales

1. **Registro de inspecciones:** fecha, fundo, lote, variedad, inspector, tamaño de
   muestra, cantidad por tipo de defecto y °Brix, con validación de datos.
2. **Dictamen automático:** cálculo en vivo del % de defectos y clasificación en
   Aprobado (≤5%), Observado (>5% y ≤10%) o Rechazado (>10%).
3. **Historial:** tabla con las inspecciones guardadas en el navegador
   (`localStorage`), sin enviar datos a un servidor.
4. **Resumen de calidad:** total de inspecciones, % aprobadas, defecto más frecuente
   y gráfico de barras accesible por tipo de defecto. Se calcula a partir de la
   lista de inspecciones que recibe, preparado para integrarse con los filtros.

## Tecnologías

HTML, CSS y JavaScript puros, sin dependencias ni paso de build. Publicada con
GitHub Pages.

## Estructura del proyecto

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Formulario, panel de resultado, historial y resumen |
| `css/styles.css` | Estilos responsive, tema claro/oscuro y accesibilidad |
| `js/calculos.js` | Funciones puras: % de defectos, dictamen y resumen |
| `js/storage.js` | Lectura y escritura en `localStorage` |
| `js/app.js` | Eventos de la interfaz y renderizado |
| `.github/copilot-instructions.md` | Reglas del proyecto para Copilot y comandos de verificación |

## Ejecución local

1. Clona el repositorio: `git clone https://github.com/aleonupc/calidad-campo.git`
2. Abre `index.html` en un navegador moderno. No requiere instalar nada.

Prueba de los cálculos (opcional, requiere Node.js): ver los comandos en
`.github/copilot-instructions.md`.

## Flujo de trabajo

El desarrollo siguió el ciclo del workshop "Copilot App": \*\*issue → sesión en
worktree aislado → revisión de cambios → pull request → merge → despliegue\*\*.
Cada issue se dejó en una etapa distinta del ciclo para evidenciarlo:

| Issue | Estado | Etapa del flujo |
| --- | --- | --- |
| #2 Resumen de calidad y gráfico | ✅ Integrado y publicado | Plan ajustado → implementación → PR → merge → GitHub Pages |
| #1 Filtros del historial | 🔍 PR abierto | Implementado en worktree aislado; pendiente de revisión y merge |
| #3 Exportación a CSV | 🕓 Backlog | Issue con criterios de aceptación, aún sin implementar |

Solo el código integrado a la rama principal se publica en GitHub Pages; por eso
los filtros y la exportación CSV no forman parte de la aplicación publicada.
