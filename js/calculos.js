(function () {
  "use strict";

  function calcular(muestra, defectos) {
    const totalDefectos = Object.values(defectos).reduce(function (total, cantidad) {
      return total + cantidad;
    }, 0);
    const porcentaje = muestra > 0 ? (totalDefectos / muestra) * 100 : 0;

    let dictamen;
    let clase;
    if (porcentaje <= 5) {
      dictamen = "Aprobado";
      clase = "approved";
    } else if (porcentaje <= 10) {
      dictamen = "Observado";
      clase = "observed";
    } else {
      dictamen = "Rechazado";
      clase = "rejected";
    }

    return { totalDefectos, porcentaje, dictamen, clase };
  }

  window.CalidadCalculos = Object.freeze({ calcular });
})();
