/**
 * CAPA DE SERVICIOS – pdf.js
 * Genera y descarga el PDF de la ficha técnica usando html2pdf.js
 */

const PdfService = (() => {

  function generate(formData) {
    const projectName = formData["nombre_producto"] || "Ficha Técnica";
    const fileName = `ficha_tecnica_${projectName.replace(/\s+/g, "_").toLowerCase()}.pdf`;

    // Construir el HTML del documento para impresión
    const content = _buildPrintContent(formData);

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     fileName,
      image:        { type: "jpeg", quality: 0.95 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak:    { mode: ["avoid-all", "css", "legacy"] }
    };

    return html2pdf().set(opt).from(content).save();
  }

  function _buildPrintContent(data) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "font-family:Arial,sans-serif;font-size:11px;color:#111;padding:4mm;";

    // Cabecera
    wrap.innerHTML = `
      <div style="text-align:center;margin-bottom:12px;padding-bottom:8px;border-bottom:3px solid #2d6a4f;">
        <h1 style="font-size:16px;font-weight:bold;color:#2d6a4f;margin:0;">FICHA TÉCNICA PARA DESARROLLO DE SOFTWARE</h1>
        <p style="margin:4px 0 0;font-size:11px;color:#555;">SERVICIO NACIONAL DE APRENDIZAJE SENA – GESTIÓN DE PROYECTOS</p>
        <p style="margin:2px 0 0;font-size:10px;color:#777;">
          FICHA: ${data["__meta_ficha"] || "___________"} &nbsp;|&nbsp;
          FECHA: ${data["__meta_fecha"] || new Date().toLocaleDateString("es-CO")}
        </p>
      </div>
    `;

    // Renderizar cada sección del modelo
    FichaTecnicaModel.sections.forEach(section => {
      const sectionEl = _renderSectionForPdf(section, data);
      wrap.appendChild(sectionEl);
    });

    // Nota final
    const note = document.createElement("p");
    note.style.cssText = "font-size:9px;color:#888;margin-top:16px;font-style:italic;text-align:center;";
    note.textContent = "Este documento fue generado automáticamente · SENA – Ficha Técnica v1.0 · " + new Date().toLocaleDateString("es-CO");
    wrap.appendChild(note);

    return wrap;
  }

  function _renderSectionForPdf(section, data) {
    const div = document.createElement("div");
    div.style.cssText = "margin-bottom:14px;page-break-inside:avoid;";

    const header = document.createElement("div");
    header.style.cssText = "background:#2d6a4f;color:white;padding:5px 8px;font-weight:bold;font-size:12px;border-radius:3px 3px 0 0;";
    header.textContent = `${section.num}. ${section.title}`;
    div.appendChild(header);

    const body = document.createElement("div");
    body.style.cssText = "border:1px solid #ccc;border-top:none;padding:8px;border-radius:0 0 3px 3px;";

    _appendSectionContent(body, section, data);
    div.appendChild(body);
    return div;
  }

  function _appendSectionContent(container, section, data) {
    const type = section.type;

    if (type === "table-kv") {
      const tbl = _makeTable(["Campo","Descripción"]);
      section.rows.forEach(row => {
        _addTableRow(tbl, [row.label, data[row.key] || ""]);
      });
      container.appendChild(tbl);
    }
    else if (type === "mixed") {
      section.subsections.forEach(sub => {
        const subDiv = document.createElement("div");
        subDiv.style.cssText = "margin-bottom:8px;";
        const subH = document.createElement("p");
        subH.style.cssText = "font-weight:bold;color:#2d6a4f;margin:6px 0 4px;font-size:11px;";
        subH.textContent = sub.label;
        subDiv.appendChild(subH);
        _appendSubsectionContent(subDiv, sub, data);
        container.appendChild(subDiv);
      });
    }
    else if (type === "fields") {
      const grid = document.createElement("div");
      grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:4px;";
      section.fields.forEach(f => {
        const p = document.createElement("div");
        p.style.cssText = "font-size:10px;";
        p.innerHTML = `<strong>${f.label}:</strong> ${data[f.key] || ""}`;
        grid.appendChild(p);
      });
      container.appendChild(grid);
    }
    else if (type === "rf-modules") {
      // Módulos fijos del modelo (con conteo dinámico)
      section.modules.forEach(mod => {
        const rfCountKey = `${mod.keyPrefix}_rfcount`;
        const rfCount = parseInt(data[rfCountKey] || String(mod.count), 10);
        const modName = mod.fixedName || data[mod.keyName] || "______";
        const modDiv = document.createElement("div");
        modDiv.style.cssText = "margin-bottom:6px;";
        const modH = document.createElement("p");
        modH.style.cssText = "font-weight:bold;font-size:10px;color:#444;margin:0 0 3px;";
        modH.textContent = `${mod.label}${mod.fixedName ? "" : " " + modName}`;
        modDiv.appendChild(modH);
        for (let i = 1; i <= rfCount; i++) {
          const num = String(i).padStart(2,"0");
          const rfKey = `${mod.keyPrefix}_rf${num}`;
          const val = data[rfKey] || "";
          const p = document.createElement("p");
          p.style.cssText = "margin:1px 0;font-size:10px;";
          p.innerHTML = `<span style="color:#1565c0;font-family:monospace;">RF-${mod.keyPrefix}-${num}</span>: ${val}`;
          modDiv.appendChild(p);
        }
        container.appendChild(modDiv);
      });
      // Módulos extra dinámicos
      const extraCount = parseInt(data["__extra_mods_count"] || "0", 10);
      for (let i = 1; i <= extraCount; i++) {
        const kp = `rfEXT${i}`;
        const rfCountKey = `${kp}_rfcount`;
        const rfCount = parseInt(data[rfCountKey] || "4", 10);
        const modName = data[`${kp}_nombre`] || "______";
        const modNum = section.modules.length + i;
        const modDiv = document.createElement("div");
        modDiv.style.cssText = "margin-bottom:6px;";
        const modH = document.createElement("p");
        modH.style.cssText = "font-weight:bold;font-size:10px;color:#444;margin:0 0 3px;";
        modH.textContent = `9.${modNum} Módulo de ${modName}`;
        modDiv.appendChild(modH);
        for (let j = 1; j <= rfCount; j++) {
          const num = String(j).padStart(2,"0");
          const rfKey = `${kp}_rf${num}`;
          const val = data[rfKey] || "";
          const p = document.createElement("p");
          p.style.cssText = "margin:1px 0;font-size:10px;";
          p.innerHTML = `<span style="color:#1565c0;font-family:monospace;">RF-${kp}-${num}</span>: ${val}`;
          modDiv.appendChild(p);
        }
        container.appendChild(modDiv);
      }
    }
    else if (type === "textarea-single") {
      const p = document.createElement("p");
      p.style.cssText = "font-size:10px;white-space:pre-wrap;";
      p.textContent = data[section.key] || "";
      container.appendChild(p);
    }
    else if (type === "table-historial") {
      const tbl = _makeTable(section.headers);
      for (let i = 0; i < section.rowCount; i++) {
        _addTableRow(tbl, [
          data[`${section.keyPrefix}_v${i}`] || "",
          data[`${section.keyPrefix}_f${i}`] || "",
          data[`${section.keyPrefix}_d${i}`] || "",
          data[`${section.keyPrefix}_r${i}`] || ""
        ]);
      }
      container.appendChild(tbl);
    }
    else if (type === "table-aprobaciones") {
      const tbl = _makeTable(section.headers);
      section.rows.forEach(row => {
        _addTableRow(tbl, [
          row.col0,
          data[`${row.key}_nombre`] || "",
          data[`${row.key}_firma`] || "",
          data[`${row.key}_fecha`] || ""
        ]);
      });
      container.appendChild(tbl);
    }
  }

  function _appendSubsectionContent(container, sub, data) {
    if (sub.type === "textarea") {
      const p = document.createElement("p");
      p.style.cssText = "font-size:10px;white-space:pre-wrap;margin:0;";
      p.textContent = data[sub.key] || "";
      container.appendChild(p);
    }
    else if (sub.type === "modules") {
      // Módulos base del modelo
      sub.keys.forEach((k, i) => {
        const p = document.createElement("p");
        p.style.cssText = "margin:1px 0;font-size:10px;";
        p.innerHTML = `<strong>${sub.labels[i]}:</strong> ${data[k] || ""}`;
        container.appendChild(p);
      });
      // Módulos extra agregados dinámicamente
      const extraCount = parseInt(data["__mod23_extra"] || "0", 10);
      for (let i = 0; i < extraCount; i++) {
        const num = sub.keys.length + i + 1;
        const key = `mod_extra_${i}`;
        const p = document.createElement("p");
        p.style.cssText = "margin:1px 0;font-size:10px;";
        p.innerHTML = `<strong>Módulo ${num}:</strong> ${data[key] || ""}`;
        container.appendChild(p);
      }
    }
    else if (sub.type === "fields") {
      const grid = document.createElement("div");
      grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:3px;";
      sub.fields.forEach(f => {
        const d = document.createElement("div");
        d.style.cssText = "font-size:10px;";
        d.innerHTML = `<strong>${f.label}:</strong> ${data[f.key] || ""}`;
        grid.appendChild(d);
      });
      container.appendChild(grid);
    }
    else if (sub.type === "fields-group") {
      sub.groups.forEach(g => {
        const gDiv = document.createElement("div");
        gDiv.style.cssText = "margin-bottom:5px;";
        const gH = document.createElement("p");
        gH.style.cssText = "font-weight:600;font-size:10px;color:#555;margin:0 0 2px;";
        gH.textContent = g.label;
        gDiv.appendChild(gH);
        const grid = document.createElement("div");
        grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:2px;";
        g.fields.forEach(f => {
          const d = document.createElement("div");
          d.style.cssText = "font-size:10px;";
          d.innerHTML = `<strong>${f.label}:</strong> ${data[f.key] || ""}`;
          grid.appendChild(d);
        });
        gDiv.appendChild(grid);
        container.appendChild(gDiv);
      });
    }
    else if (sub.type === "table-3col") {
      const tbl = _makeTable(sub.headers);
      sub.rows.forEach(row => {
        _addTableRow(tbl, [
          row.col0,
          data[`${row.key}_col1`] || "",
          data[`${row.key}_col2`] || ""
        ]);
      });
      container.appendChild(tbl);
    }
    else if (sub.type === "table-2col") {
      const tbl = _makeTable(sub.headers);
      sub.rows.forEach(row => {
        _addTableRow(tbl, [row.col0, data[row.key] || ""]);
      });
      container.appendChild(tbl);
    }
    else if (sub.type === "steps") {
      sub.keys.forEach((k, i) => {
        const p = document.createElement("p");
        p.style.cssText = "margin:1px 0;font-size:10px;";
        p.innerHTML = `<strong>Paso ${i+1}:</strong> ${data[k] || ""}`;
        container.appendChild(p);
      });
    }
    else if (sub.type === "phases") {
      sub.keys.forEach((k, i) => {
        const p = document.createElement("p");
        p.style.cssText = "margin:1px 0;font-size:10px;";
        p.innerHTML = `<strong>Fase ${i+1}:</strong> ${data[k+"_nombre"] || "___"} — <em>${data[k+"_semanas"] || "_"} semana(s)</em>`;
        container.appendChild(p);
      });
    }
  }

  function _makeTable(headers) {
    const tbl = document.createElement("table");
    tbl.style.cssText = "width:100%;border-collapse:collapse;font-size:10px;";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.style.cssText = "background:#e8f5e9;color:#2d6a4f;padding:3px 6px;text-align:left;border:1px solid #ccc;font-size:10px;";
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tbl.appendChild(thead);
    tbl.appendChild(document.createElement("tbody"));
    return tbl;
  }

  function _addTableRow(tbl, cells) {
    const tbody = tbl.querySelector("tbody");
    const tr = document.createElement("tr");
    cells.forEach((c, i) => {
      const td = document.createElement("td");
      td.style.cssText = `padding:3px 6px;border:1px solid #ddd;font-size:10px;${i===0?"font-weight:600;color:#333;":""}`;
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  return { generate };
})();
