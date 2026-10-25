# Copilot instructions

## Project structure and architecture

CalidadCampo is a dependency-free, static Spanish-language web app. Open `index.html` directly in a browser; there is no build step or server. The page loads `css/styles.css`, then the deferred scripts in this order: `js/storage.js`, `js/calculos.js`, and `js/app.js`.

The browser app is split into three small responsibilities:

- `js/calculos.js` owns pure inspection calculations: sum the five defect counts, divide by sample size, classify the result as Aprobado (≤5%), Observado (>5% and ≤10%), or Rechazado (>10%), and aggregate quality indicators and defect totals for the inspection list passed to `resumirInspecciones`. It exposes `window.CalidadCalculos`.
- `js/storage.js` reads and writes the `calidadcampo.inspecciones.v1` localStorage entry and exposes `window.CalidadStorage`. Records are prepended so the newest inspection appears first.
- `js/app.js` binds the form and live preview, validates and saves submissions, renders the inspection table, quality summary, defect chart and accessible data table, and reports storage errors. It uses the calculation and storage globals rather than duplicating their logic.
- `index.html` defines the Spanish form, result panel, and history/dashboard markup. Keep its script order aligned with the globals it consumes.
- `css/styles.css` contains the responsive layout, shared color tokens, dark-mode overrides, and reduced-motion/accessibility styles.

## Build, test, and lint

There is no package manifest, build tool, test runner, or linter configured. No install step is needed.

- Run the app by opening `index.html` in a browser (or the integrated browser).
- Check an individual JavaScript file's syntax with `node --check js/app.js`; substitute `js/calculos.js` or `js/storage.js` to check another file.
- Run a single calculation boundary check with Node, using the persisted defect field names:

  ```sh
  node -e "const assert=require('node:assert/strict');global.window={};require('./js/calculos.js');const c=window.CalidadCalculos.calcular;const d=n=>({pudricion:n,partidura:0,golpe:0,bajoCalibre:0,quemaduraSol:0});assert.equal(c(100,d(5)).dictamen,'Aprobado');assert.equal(c(100,d(10)).dictamen,'Observado');assert.equal(c(100,d(11)).dictamen,'Rechazado');console.log('Calculation boundaries passed');"
  ```

- Check inspection aggregation, defect ties, and empty/no-defect histories with Node:

  ```sh
  node -e "const assert=require('node:assert/strict');global.window={};require('./js/calculos.js');const resumir=window.CalidadCalculos.resumirInspecciones;const inspeccion=(cambios={})=>Object.assign({muestra:100,brix:12,pudricion:0,partidura:0,golpe:0,bajoCalibre:0,quemaduraSol:0},cambios);const resumen=resumir([inspeccion({pudricion:2,golpe:1}),inspeccion({pudricion:1,golpe:2})]);assert.deepEqual(resumen.defectos.map(d=>d.cantidad),[3,0,3,0,0]);assert.deepEqual(resumen.masFrecuentes.map(d=>d.etiqueta),['Pudrición','Golpe']);assert.equal(resumen.maxDefectos,3);assert.deepEqual(resumir([]).masFrecuentes,[]);const sinDefectos=resumir([inspeccion()]);assert.equal(sinDefectos.maxDefectos,0);assert.deepEqual(sinDefectos.masFrecuentes,[]);console.log('Inspection aggregation checks passed');"
  ```

For end-to-end changes, verify the form and live verdict in a browser, save an inspection, reload to check localStorage persistence, and exercise invalid input and keyboard focus.

## Codebase conventions

- Keep the app dependency-free and usable from a local `file://` URL; avoid module imports, server-only APIs, and external assets.
- JavaScript files use strict-mode IIFEs and expose only the named `window.CalidadCalculos` and `window.CalidadStorage` APIs. Preserve the script loading order when adding cross-file behavior.
- Keep inspection field names consistent across the HTML `name` attributes, the defect list and record shape in `js/app.js`, calculations, and saved localStorage records. Defect quantities are nonnegative integers; sample size is a positive integer; °Brix is numeric and limited to 0–100.
- Keep asset URLs relative to the page so the app works when deployed under a GitHub Pages subpath.
- Keep the defect thresholds and verdict labels consistent between `js/calculos.js`, the live result panel, and the history badges. The 5% boundary is approved and the 10% boundary is observed.
- Render user-provided values as text (`textContent` or text nodes), not interpolated HTML. Keep storage failures visible to the user rather than silently replacing saved history.
- Build charts only with native SVG or canvas, and provide an accessible text alternative or data table. Export CSV in-browser with `Blob`, a UTF-8 BOM, and `;` delimiters for Spanish Excel.
- Filters may change which records are displayed but must never alter the records persisted in localStorage. If the record shape changes, keep the `v1` key compatible by supplying defaults for newly introduced fields when reading existing records.
- The interface copy is Spanish. Preserve semantic HTML, explicit form labels, table header scopes, visible focus, live-region feedback, and the skip link when changing UI behavior.
- Add responsive styles alongside the existing breakpoints in `css/styles.css`; use its CSS custom properties for surfaces, text, borders, and verdict colors, and retain `prefers-color-scheme: dark` and `prefers-reduced-motion` support.
- Write commit messages and pull request descriptions in Spanish, and reference the related issue (for example, `Closes #2`).
