/**
 * CAPA DE SERVICIOS – share.js
 * Gestiona el compartir por WhatsApp.
 * Usa la API oficial de wa.me para enviar un mensaje de texto con resumen.
 * Nota: WhatsApp no permite enviar archivos adjuntos directamente desde web
 * sin una cuenta de WhatsApp Business API. Se envía el resumen como texto.
 */

const ShareService = (() => {

  function buildSummary(data) {
    const lines = [];
    lines.push("📋 *FICHA TÉCNICA – SENA*");
    lines.push("━━━━━━━━━━━━━━━━━━━━");

    const add = (label, key) => {
      const val = data[key];
      if (val) lines.push(`*${label}:* ${val}`);
    };

    add("Proyecto",     "nombre_producto");
    add("Responsables", "responsables");
    add("Versión",      "version_actual");
    add("Fecha inicio", "fecha_inicio");
    add("Estado",       "estado");

    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("*Objetivo:*");
    if (data["objetivo"]) lines.push(data["objetivo"].substring(0, 200) + (data["objetivo"].length > 200 ? "..." : ""));

    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("*Tecnologías:*");
    add("Lenguaje",    "tech_lang_col1");
    add("Backend",     "tech_backend_col1");
    add("Frontend",    "tech_frontend_col1");
    add("Base datos",  "tech_db_col1");
    add("Hosting",     "tech_hosting_col1");

    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("*Módulos:*");
    for (let i = 1; i <= 9; i++) {
      const val = data[`mod${i}`];
      if (val) lines.push(`  • ${val}`);
    }

    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`_Generado: ${new Date().toLocaleDateString("es-CO")} · SENA Ficha Técnica v1.0_`);

    return lines.join("\n");
  }

  function sendWhatsApp(phoneNumber, data) {
    // Limpiar número: solo dígitos
    const clean = phoneNumber.replace(/\D/g, "");

    // Agregar indicativo de Colombia si es número local (10 dígitos)
    const intl = clean.length === 10 ? "57" + clean : clean;

    const summary = buildSummary(data);
    const encoded = encodeURIComponent(summary);
    const url = `https://wa.me/${intl}?text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return { sendWhatsApp, buildSummary };
})();
