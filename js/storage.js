(function () {
  "use strict";

  const STORAGE_KEY = "calidadcampo.inspecciones.v1";

  function obtenerInspecciones() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];

    const inspections = JSON.parse(stored);
    if (!Array.isArray(inspections)) {
      throw new Error("El historial guardado no tiene un formato válido.");
    }
    return inspections;
  }

  function guardarInspeccion(inspection) {
    const inspections = obtenerInspecciones();
    inspections.unshift(inspection);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
    return inspections;
  }

  window.CalidadStorage = Object.freeze({
    obtenerInspecciones,
    guardarInspeccion
  });
})();
