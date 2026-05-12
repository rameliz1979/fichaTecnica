/**
 * CONTROLADOR PRINCIPAL – app.js
 * Orquesta todas las capas: modelo → servicios → UI
 * Este archivo se carga último.
 */

(function () {
  "use strict";

  // ── Elementos del DOM ───────────────────────────
  const formRoot     = document.getElementById("form-root");
  const btnSave      = document.getElementById("btn-save");
  const btnClear     = document.getElementById("btn-clear");
  const btnExport    = document.getElementById("btn-export");
  const btnImport    = document.getElementById("btn-import");
  const btnPdf       = document.getElementById("btn-pdf");
  const btnWhatsapp  = document.getElementById("btn-whatsapp");
  const progressBar  = document.getElementById("progress-bar");
  const progressPct  = document.getElementById("progress-pct");
  const modalWA      = document.getElementById("modal-wa");
  const modalWACancel= document.getElementById("modal-wa-cancel");
  const modalWASend  = document.getElementById("modal-wa-send");
  const waNumber     = document.getElementById("wa-number");
  const toast        = document.getElementById("toast");

  // ── Estado ──────────────────────────────────────
  let autoSaveTimer = null;

  // ── Inicialización ──────────────────────────────
  function init() {
    const savedData = StorageService.load();
    FormUI.render(formRoot, savedData);
    updateProgress();
    bindEvents();

    if (StorageService.exists()) {
      showToast("✅ Borrador cargado automáticamente", 2000);
    }
  }

  // ── Eventos ─────────────────────────────────────
  function bindEvents() {
    // Auto-guardado al escribir (debounce 800ms)
    formRoot.addEventListener("input", () => {
      clearTimeout(autoSaveTimer);
      updateProgress();
      autoSaveTimer = setTimeout(() => {
        StorageService.save(FormUI.collectData(formRoot));
      }, 800);
    });

    // Guardar manualmente
    btnSave.addEventListener("click", () => {
      StorageService.save(FormUI.collectData(formRoot));
      showToast("💾 Borrador guardado correctamente");
    });

    // Exportar progreso como .json
    btnExport.addEventListener("click", () => {
      const data = FormUI.collectData(formRoot);
      StorageService.save(data);
      StorageService.exportJSON(data);
      showToast("📦 Progreso exportado — guarda el archivo .json");
    });

    // Importar progreso desde .json
    btnImport.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = await StorageService.importJSON(file);
        StorageService.save(data);
        FormUI.render(formRoot, data);
        updateProgress();
        bindEvents();
        showToast("✅ Progreso importado correctamente", 3000);
      } catch (err) {
        showToast("❌ " + err.message, 4000);
      } finally {
        // Resetear el input para permitir re-importar el mismo archivo
        e.target.value = "";
      }
    });

    // Limpiar formulario
    btnClear.addEventListener("click", () => {
      if (confirm("¿Estás seguro de limpiar todo el formulario? Esta acción no se puede deshacer.")) {
        StorageService.clear();
        FormUI.render(formRoot, {});
        updateProgress();
        bindEvents(); // Re-bind tras re-render
        showToast("🗑 Formulario limpiado");
      }
    });

    // Descargar PDF
    btnPdf.addEventListener("click", async () => {
      const data = FormUI.collectData(formRoot);
      StorageService.save(data);
      showToast("📄 Generando PDF, por favor espera...", 4000);
      btnPdf.disabled = true;
      btnPdf.textContent = "⏳ Generando...";
      try {
        await PdfService.generate(data);
        showToast("✅ PDF descargado correctamente");
      } catch (e) {
        console.error(e);
        showToast("❌ Error al generar el PDF", 3000);
      } finally {
        btnPdf.disabled = false;
        btnPdf.textContent = "📄 Descargar PDF";
      }
    });

    // WhatsApp – abrir modal
    btnWhatsapp.addEventListener("click", () => {
      modalWA.classList.remove("hidden");
    });

    // WhatsApp – cancelar
    modalWACancel.addEventListener("click", () => {
      modalWA.classList.add("hidden");
    });

    // WhatsApp – enviar
    modalWASend.addEventListener("click", () => {
      const number = waNumber.value.trim();
      if (!number) {
        showToast("⚠️ Ingresa un número de WhatsApp válido", 2000);
        return;
      }
      const data = FormUI.collectData(formRoot);
      ShareService.sendWhatsApp(number, data);
      modalWA.classList.add("hidden");
      showToast("📲 Abriendo WhatsApp...");
    });

    // Cerrar modal al hacer click fuera
    modalWA.addEventListener("click", (e) => {
      if (e.target === modalWA) modalWA.classList.add("hidden");
    });

    // Cerrar modal con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modalWA.classList.add("hidden");
    });
  }

  // ── Progreso ────────────────────────────────────
  function updateProgress() {
    const pct = FormUI.calcProgress(formRoot);
    progressBar.style.width = pct + "%";
    progressPct.textContent = pct + "%";

    // Color según progreso
    progressBar.classList.remove("bg-red-400","bg-yellow-400","bg-green-500");
    if (pct < 30) progressBar.classList.add("bg-red-400");
    else if (pct < 70) progressBar.classList.add("bg-yellow-400");
    else progressBar.classList.add("bg-green-500");
  }

  // ── Toast ───────────────────────────────────────
  let toastTimer = null;
  function showToast(msg, duration = 2500) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.remove("hidden");
    toast.style.opacity = "1";
    toastTimer = setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, duration);
  }

  // ── Arrancar ────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);

})();
