(function () {
  "use strict";

  const DEFECT_FIELDS = [
    { name: "pudricion", label: "Pudrición" },
    { name: "partidura", label: "Partidura" },
    { name: "golpe", label: "Golpe" },
    { name: "bajoCalibre", label: "Bajo calibre" },
    { name: "quemaduraSol", label: "Quemadura de sol" }
  ];

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

  function resumirInspecciones(inspecciones) {
    const defectos = DEFECT_FIELDS.map(function (field) {
      return { campo: field.name, etiqueta: field.label, cantidad: 0 };
    });
    const resultados = [];
    let aprobadas = 0;
    let porcentajeDefectosTotal = 0;
    let brixTotal = 0;

    inspecciones.forEach(function (inspeccion) {
      const defectosInspeccion = {};
      DEFECT_FIELDS.forEach(function (field, index) {
        const cantidad = inspeccion[field.name];
        defectosInspeccion[field.name] = cantidad;
        defectos[index].cantidad += cantidad;
      });

      const resultado = calcular(inspeccion.muestra, defectosInspeccion);
      resultados.push(resultado);
      aprobadas += resultado.dictamen === "Aprobado" ? 1 : 0;
      porcentajeDefectosTotal += resultado.porcentaje;
      brixTotal += inspeccion.brix;
    });

    const total = inspecciones.length;
    const maxDefectos = defectos.reduce(function (maximo, defecto) {
      return Math.max(maximo, defecto.cantidad);
    }, 0);
    const masFrecuentes = maxDefectos > 0
      ? defectos.filter(function (defecto) { return defecto.cantidad === maxDefectos; })
      : [];

    return {
      total,
      aprobadas,
      porcentajeAprobacion: total ? (aprobadas / total) * 100 : null,
      porcentajeDefectosPromedio: total ? porcentajeDefectosTotal / total : null,
      brixPromedio: total ? brixTotal / total : null,
      defectos,
      maxDefectos,
      masFrecuentes,
      resultados
    };
  }

  window.CalidadCalculos = Object.freeze({ calcular, resumirInspecciones });
})();
