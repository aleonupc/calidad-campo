# CalidadCampo

## Contexto

CalidadCampo es una aplicación web estática para registrar y consultar inspecciones de calidad de fruta durante la cosecha en campo agrícola. Funciona directamente en el navegador, sin servidor ni dependencias externas.

## Problemática

El control de calidad en campo requiere registrar muestras, defectos y madurez de forma consistente para decidir si la fruta cumple los criterios de aceptación. Sin un registro claro y un cálculo uniforme, comparar inspecciones y conservar el historial resulta más difícil.

## Usuario objetivo

Inspectores de calidad de fruta que trabajan en fundos y lotes agrícolas.

## Objetivo

Facilitar el registro local de inspecciones y entregar un dictamen inmediato y consistente a partir del porcentaje de defectos encontrados en cada muestra.

## Funcionalidades

- Registro de fecha, fundo, lote, variedad, inspector, tamaño de muestra, defectos y °Brix.
- Cálculo en vivo del porcentaje de defectos y dictamen: Aprobado (≤5%), Observado (>5% y ≤10%) o Rechazado (>10%).
- Validación de datos y de que el total de defectos no supere la muestra.
- Historial, indicadores de calidad y gráfico accesible de defectos.
- Filtros del historial y exportación CSV.
- Persistencia local mediante `localStorage`, sin enviar los datos a un servidor.
- Diseño adaptable, accesible y compatible con los temas claro y oscuro del sistema.

## Ejecución local

No se requiere instalar dependencias ni iniciar un servidor. Abre `index.html` directamente en un navegador moderno. Las inspecciones se guardan en el almacenamiento local de ese navegador.

## Aplicación

[Abrir CalidadCampo](https://aleonupc.github.io/calidad-campo/)

## Uso de GitHub Copilot

GitHub Copilot puede ayudar a explorar la arquitectura, implementar cambios y revisar su comportamiento. Antes de proponer cambios, consulta `.github/copilot-instructions.md` para conocer el orden de carga de los scripts, las reglas de cálculo y almacenamiento, y los comandos de verificación disponibles. Verifica los cambios con los comandos pertinentes y, para cambios de interfaz, en el navegador.
