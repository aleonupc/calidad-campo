(function () {
  "use strict";

  const DEFECT_FIELDS = [
    { name: "pudricion", label: "pudrición" },
    { name: "partidura", label: "partidura" },
    { name: "golpe", label: "golpe" },
    { name: "bajoCalibre", label: "bajo calibre" },
    { name: "quemaduraSol", label: "quemadura de sol" }
  ];
  const VERDICT_CLASSES = ["verdict-neutral", "verdict-approved", "verdict-observed", "verdict-rejected"];
  const BADGE_CLASSES = {
    Aprobado: "badge-approved",
    Observado: "badge-observed",
    Rechazado: "badge-rejected"
  };
  const form = document.getElementById("inspection-form");
  const formMessage = document.getElementById("form-message");
  const storageMessage = document.getElementById("storage-message");

  document.getElementById("fecha").value = fechaLocal(new Date());
  document.getElementById("today-label").textContent = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  function fechaLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function formatNumber(value, maximumFractionDigits) {
    return new Intl.NumberFormat("es-PE", { maximumFractionDigits: maximumFractionDigits }).format(value);
  }

  function parseNumber(field) {
    return field.value.trim() === "" ? NaN : Number(field.value);
  }

  function getDefects() {
    return DEFECT_FIELDS.reduce(function (defects, field) {
      defects[field.name] = parseNumber(form.elements[field.name]);
      return defects;
    }, {});
  }

  function updatePreview() {
    const muestra = parseNumber(form.elements.muestra);
    const defects = getDefects();
    const defectsComplete = Object.values(defects).every(Number.isFinite);
    const validSample = Number.isInteger(muestra) && muestra > 0;
    const verdictPanel = document.getElementById("verdict-panel");
    const rate = document.getElementById("defect-rate");
    const progressBar = document.getElementById("progress-bar");
    const progressTrack = document.getElementById("progress-track");
    const verdictText = document.getElementById("verdict-text");
    const verdictDetail = document.getElementById("verdict-detail");

    if (!validSample || !defectsComplete) {
      VERDICT_CLASSES.forEach(function (className) { verdictPanel.classList.remove(className); });
      verdictPanel.classList.add("verdict-neutral");
      verdictText.textContent = "En espera";
      verdictDetail.textContent = "Completa la muestra y los defectos";
      rate.textContent = "—%";
      progressBar.style.width = "0%";
      progressTrack.setAttribute("aria-valuenow", "0");
      progressTrack.classList.remove("is-observed", "is-rejected");
      return;
    }

    const result = window.CalidadCalculos.calcular(muestra, defects);
    const percentage = Math.min(result.porcentaje, 100);
    VERDICT_CLASSES.forEach(function (className) { verdictPanel.classList.remove(className); });
    verdictPanel.classList.add("verdict-" + result.clase);
    verdictText.textContent = result.dictamen;
    verdictDetail.textContent = formatNumber(result.totalDefectos, 0) + " de " + formatNumber(muestra, 0) + " frutos con defectos";
    rate.textContent = formatNumber(result.porcentaje, 2) + "%";
    progressBar.style.width = percentage + "%";
    progressTrack.setAttribute("aria-valuenow", String(Math.round(percentage)));
    progressTrack.classList.toggle("is-observed", result.clase === "observed");
    progressTrack.classList.toggle("is-rejected", result.clase === "rejected");
  }

  function showFormMessage(message, isSuccess) {
    formMessage.textContent = message;
    formMessage.classList.toggle("is-success", Boolean(isSuccess));
    formMessage.setAttribute("role", isSuccess ? "status" : "alert");
    formMessage.setAttribute("aria-live", isSuccess ? "polite" : "assertive");
    formMessage.hidden = false;
  }

  function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.classList.remove("is-success");
    formMessage.setAttribute("role", "alert");
    formMessage.setAttribute("aria-live", "assertive");
    formMessage.hidden = true;
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
  }

  function markInvalid(field) {
    field.setAttribute("aria-invalid", "true");
  }

  function createCell(text, className) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = text;
    return cell;
  }

  function createLocationCell(inspection) {
    const cell = document.createElement("td");
    cell.className = "location-cell";
    const farm = document.createElement("strong");
    farm.textContent = inspection.fundo;
    const lot = document.createElement("span");
    lot.textContent = inspection.lote;
    cell.append(farm, lot);
    return cell;
  }

  function createVerdictCell(verdict) {
    const cell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "result-badge " + BADGE_CLASSES[verdict];
    badge.textContent = verdict;
    cell.appendChild(badge);
    return cell;
  }

  function renderInspection(inspection) {
    const row = document.createElement("tr");
    const result = window.CalidadCalculos.calcular(inspection.muestra, {
      pudricion: inspection.pudricion,
      partidura: inspection.partidura,
      golpe: inspection.golpe,
      bajoCalibre: inspection.bajoCalibre,
      quemaduraSol: inspection.quemaduraSol
    });
    const dateParts = inspection.fecha.split("-");
    const displayDate = dateParts.length === 3 ? dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] : inspection.fecha;

    row.append(
      createCell(displayDate),
      createLocationCell(inspection),
      createCell(inspection.variedad),
      createCell(inspection.inspector),
      createCell(formatNumber(inspection.muestra, 0)),
      createCell(formatNumber(result.totalDefectos, 0)),
      createCell(formatNumber(result.porcentaje, 2) + "%"),
      createCell(formatNumber(inspection.brix, 1)),
      createVerdictCell(result.dictamen)
    );
    return row;
  }

  function renderInspections(inspections) {
    const list = document.getElementById("inspection-list");
    const emptyState = document.getElementById("empty-state");
    list.replaceChildren();
    inspections.forEach(function (inspection) {
      list.appendChild(renderInspection(inspection));
    });
    emptyState.hidden = inspections.length > 0;
    document.getElementById("record-count").textContent = inspections.length + (inspections.length === 1 ? " registro" : " registros");
    renderQualitySummary(inspections);
  }

  function renderQualitySummary(inspections) {
    const summary = inspections.reduce(function (totals, inspection) {
      const result = window.CalidadCalculos.calcular(inspection.muestra, {
        pudricion: inspection.pudricion,
        partidura: inspection.partidura,
        golpe: inspection.golpe,
        bajoCalibre: inspection.bajoCalibre,
        quemaduraSol: inspection.quemaduraSol
      });
      totals.approved += result.dictamen === "Aprobado" ? 1 : 0;
      totals.defectRate += result.porcentaje;
      totals.brix += inspection.brix;
      return totals;
    }, { approved: 0, defectRate: 0, brix: 0 });
    const total = inspections.length;

    document.getElementById("metric-total").textContent = formatNumber(total, 0);
    document.getElementById("metric-approval").textContent = total
      ? formatNumber((summary.approved / total) * 100, 1) + "%"
      : "—";
    document.getElementById("metric-approval-detail").textContent = total
      ? formatNumber(summary.approved, 0) + " de " + formatNumber(total, 0) + " inspecciones"
      : "de las inspecciones";
    document.getElementById("metric-defects").textContent = total
      ? formatNumber(summary.defectRate / total, 1) + "%"
      : "—";
    document.getElementById("metric-brix").textContent = total
      ? formatNumber(summary.brix / total, 1)
      : "—";
  }

  function validateInspection() {
    let firstInvalid = null;
    const requiredFields = Array.from(form.querySelectorAll("input[required]"));

    requiredFields.forEach(function (field) {
      const value = field.value.trim();
      const isMissing = value === "";
      const number = field.type === "number" ? parseNumber(field) : null;
      const isInvalidNumber = field.type === "number" && (
        !Number.isFinite(number) ||
        (field.id === "muestra" && (!Number.isInteger(number) || number < 1)) ||
        (field.id !== "muestra" && field.id !== "brix" && (!Number.isInteger(number) || number < 0)) ||
        (field.id === "brix" && (number < 0 || number > 100))
      );

      if (isMissing || isInvalidNumber) {
        markInvalid(field);
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      const isMissing = firstInvalid.value.trim() === "";
      showFormMessage(isMissing ? "Completa todos los campos antes de guardar." : "Revisa los valores: la muestra debe ser un entero positivo, los defectos enteros no negativos y °Brix debe estar entre 0 y 100.");
      firstInvalid.focus();
      return false;
    }

    const muestra = parseNumber(form.elements.muestra);
    const defects = getDefects();
    const total = Object.values(defects).reduce(function (sum, quantity) { return sum + quantity; }, 0);
    if (total > muestra) {
      const field = form.elements.muestra;
      markInvalid(field);
      showFormMessage("El total de defectos (" + formatNumber(total, 0) + ") no puede superar la muestra (" + formatNumber(muestra, 0) + ").");
      field.focus();
      return false;
    }

    return true;
  }

  form.addEventListener("input", function () {
    clearFormMessage();
    updatePreview();
  });
  form.addEventListener("change", function () {
    clearFormMessage();
    updatePreview();
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFormMessage();
    if (!validateInspection()) return;

    const inspection = {
      fecha: form.elements.fecha.value,
      fundo: form.elements.fundo.value.trim(),
      lote: form.elements.lote.value.trim(),
      variedad: form.elements.variedad.value.trim(),
      inspector: form.elements.inspector.value.trim(),
      muestra: parseNumber(form.elements.muestra),
      pudricion: parseNumber(form.elements.pudricion),
      partidura: parseNumber(form.elements.partidura),
      golpe: parseNumber(form.elements.golpe),
      bajoCalibre: parseNumber(form.elements.bajoCalibre),
      quemaduraSol: parseNumber(form.elements.quemaduraSol),
      brix: parseNumber(form.elements.brix)
    };

    try {
      const inspections = window.CalidadStorage.guardarInspeccion(inspection);
      renderInspections(inspections);
      storageMessage.hidden = true;
      form.reset();
      form.elements.fecha.value = fechaLocal(new Date());
      DEFECT_FIELDS.forEach(function (field) { form.elements[field.name].value = "0"; });
      updatePreview();
      showFormMessage("Inspección guardada correctamente.", true);
    } catch (error) {
      showFormMessage("No se pudo guardar la inspección en este dispositivo. " + error.message);
    }
  });

  try {
    renderInspections(window.CalidadStorage.obtenerInspecciones());
  } catch (error) {
    renderInspections([]);
    storageMessage.textContent = "No se pudo leer el historial local. " + error.message;
    storageMessage.hidden = false;
  }
  updatePreview();
})();
