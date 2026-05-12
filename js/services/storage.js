/**
 * CAPA DE SERVICIOS – storage.js
 * Gestiona la persistencia de datos en localStorage,
 * y la exportación / importación de progreso en JSON.
 */

const StorageService = (() => {
  const KEY = "sena_ficha_tecnica_v1";

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("StorageService.save error:", e);
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("StorageService.load error:", e);
      return {};
    }
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function exists() {
    return !!localStorage.getItem(KEY);
  }

  /** Descarga los datos actuales como archivo .json */
  function exportJSON(data) {
    const proyecto = (data["nombre_producto"] || "ficha").replace(/\s+/g, "_").toLowerCase();
    const fecha    = new Date().toISOString().slice(0, 10);
    const filename = `ficha_tecnica_${proyecto}_${fecha}.json`;

    const blob = new Blob(
      [JSON.stringify({ _version: "1.0", _exportedAt: new Date().toISOString(), data }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importa un archivo .json exportado previamente.
   * @param {File} file  – archivo seleccionado por el usuario
   * @returns {Promise<object>} – los datos importados
   */
  function importJSON(file) {
    return new Promise((resolve, reject) => {
      if (!file || file.type !== "application/json") {
        return reject(new Error("El archivo debe ser un .json exportado desde esta aplicación."));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          // Acepta tanto el formato envuelto { _version, data } como un objeto plano
          const payload = parsed.data || parsed;
          if (typeof payload !== "object" || Array.isArray(payload)) {
            return reject(new Error("Formato de archivo no válido."));
          }
          resolve(payload);
        } catch {
          reject(new Error("No se pudo leer el archivo. Asegúrate de que sea un JSON válido."));
        }
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo."));
      reader.readAsText(file);
    });
  }

  return { save, load, clear, exists, exportJSON, importJSON };
})();
