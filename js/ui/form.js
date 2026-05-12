/**
 * CAPA UI – form.js
 * Renderiza dinámicamente el formulario a partir del modelo de datos.
 * Toda manipulación del DOM vive aquí.
 */

const FormUI = (() => {

  // ──────────────────────────────────────────────
  // RENDER PRINCIPAL
  // ──────────────────────────────────────────────
  function render(container, data) {
    container.innerHTML = "";

    // Meta: ficha y fecha
    container.appendChild(_renderMeta(data));

    // Secciones del modelo
    FichaTecnicaModel.sections.forEach((section, idx) => {
      const card = _renderSection(section, data, idx);
      container.appendChild(card);
    });
  }

  // ──────────────────────────────────────────────
  // META (ficha + fecha)
  // ──────────────────────────────────────────────
  function _renderMeta(data) {
    const div = document.createElement("div");
    div.className = "section-card";
    div.innerHTML = `
      <div class="section-header" style="cursor:default;">
        <h2 class="text-base font-semibold text-gray-700">Datos de identificación del documento</h2>
      </div>
      <div class="section-body">
        <div class="grid-2">
          <div>
            <label class="form-label">Número de Ficha</label>
            <input type="text" class="form-input" data-key="__meta_ficha"
              value="${_esc(data["__meta_ficha"] || "")}" placeholder="Ej: 2847613" />
          </div>
          <div>
            <label class="form-label">Fecha del documento</label>
            <input type="date" class="form-input" data-key="__meta_fecha"
              value="${_esc(data["__meta_fecha"] || new Date().toISOString().split("T")[0])}" />
          </div>
        </div>
      </div>
    `;
    return div;
  }

  // ──────────────────────────────────────────────
  // SECCIÓN GENÉRICA (colapsable)
  // ──────────────────────────────────────────────
  function _renderSection(section, data, idx) {
    const card = document.createElement("div");
    card.className = "section-card";
    card.id = `section-${section.id}`;

    // Header colapsable
    const header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `
      <h2 class="text-base font-semibold text-gray-800 flex items-center">
        <span class="section-badge">${section.num}</span>
        ${section.title}
      </h2>
      <svg class="chevron w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    `;

    const body = document.createElement("div");
    body.className = "section-body";
    // Las primeras 2 secciones abiertas, el resto colapsadas
    if (idx > 2) {
      body.style.display = "none";
    } else {
      header.querySelector(".chevron").classList.add("open");
    }

    // Toggle colapsado
    header.addEventListener("click", () => {
      const isOpen = body.style.display !== "none";
      body.style.display = isOpen ? "none" : "block";
      header.querySelector(".chevron").classList.toggle("open", !isOpen);
    });

    // Contenido según tipo
    _appendContent(body, section, data);

    card.appendChild(header);
    card.appendChild(body);
    return card;
  }

  // ──────────────────────────────────────────────
  // DISPATCHER DE TIPOS DE CONTENIDO
  // ──────────────────────────────────────────────
  function _appendContent(container, section, data) {
    switch (section.type) {
      case "table-kv":         _renderTableKV(container, section, data); break;
      case "mixed":            _renderMixed(container, section, data); break;
      case "fields":           _renderFields(container, section.fields, data); break;
      case "rf-modules":       _renderRFModules(container, section, data); break;
      case "textarea-single":  _renderTextareaSingle(container, section, data); break;
      case "table-historial":  _renderTableHistorial(container, section, data); break;
      case "table-aprobaciones": _renderTableAprobaciones(container, section, data); break;
    }
  }

  // ──────────────────────────────────────────────
  // TABLA CLAVE-VALOR (sección 1)
  // ──────────────────────────────────────────────
  function _renderTableKV(container, section, data) {
    const tbl = document.createElement("table");
    tbl.className = "form-table w-full";
    tbl.innerHTML = `<thead><tr>
      <th class="w-1/3">Campo</th>
      <th>Descripción</th>
    </tr></thead><tbody></tbody>`;

    const tbody = tbl.querySelector("tbody");
    section.rows.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="font-medium text-gray-700 w-1/3">${row.label}</td><td></td>`;
      const td = tr.querySelectorAll("td")[1];
      td.appendChild(_makeInput(row, data));
      tbody.appendChild(tr);
    });

    container.appendChild(tbl);
  }

  // ──────────────────────────────────────────────
  // MIXED: itera subsecciones
  // ──────────────────────────────────────────────
  function _renderMixed(container, section, data) {
    section.subsections.forEach(sub => {
      const subDiv = document.createElement("div");

      // Sub-header
      const sh = document.createElement("h3");
      sh.className = "text-sm font-semibold text-sena-green mb-2 mt-3";
      sh.textContent = sub.label;
      subDiv.appendChild(sh);

      _appendSubContent(subDiv, sub, data);
      container.appendChild(subDiv);
    });
  }

  function _appendSubContent(container, sub, data) {
    switch (sub.type) {
      case "textarea":
        _renderTextareaField(container, sub.key, data, sub.placeholder);
        break;
      case "fields":
        _renderFields(container, sub.fields, data);
        break;
      case "fields-group":
        sub.groups.forEach(g => {
          const gDiv = document.createElement("div");
          gDiv.className = "mb-4";
          const gh = document.createElement("p");
          gh.className = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2";
          gh.textContent = g.label;
          gDiv.appendChild(gh);
          _renderFields(gDiv, g.fields, data);
          container.appendChild(gDiv);
        });
        break;
      case "modules":
        _renderModules(container, sub, data);
        break;
      case "table-3col":
        _renderTable3Col(container, sub, data);
        break;
      case "table-2col":
        _renderTable2Col(container, sub, data);
        break;
      case "steps":
        _renderSteps(container, sub, data);
        break;
      case "phases":
        _renderPhases(container, sub, data);
        break;
    }
  }

  // ──────────────────────────────────────────────
  // CAMPOS SIMPLES
  // ──────────────────────────────────────────────
  function _renderFields(container, fields, data) {
    const grid = document.createElement("div");
    grid.className = "grid-2";
    fields.forEach(f => {
      const div = document.createElement("div");
      div.innerHTML = `<label class="form-label">${f.label}</label>`;
      div.appendChild(_makeInput(f, data));
      grid.appendChild(div);
    });
    container.appendChild(grid);
  }

  function _renderTextareaField(container, key, data, placeholder = "") {
    const ta = document.createElement("textarea");
    ta.className = "form-textarea w-full";
    ta.dataset.key = key;
    ta.placeholder = placeholder;
    ta.value = data[key] || "";
    container.appendChild(ta);
  }

  function _renderTextareaSingle(container, section, data) {
    const ta = document.createElement("textarea");
    ta.className = "form-textarea w-full";
    ta.style.minHeight = "120px";
    ta.dataset.key = section.key;
    ta.placeholder = section.placeholder || "";
    ta.value = data[section.key] || "";
    container.appendChild(ta);
  }

  // ──────────────────────────────────────────────
  // MÓDULOS (lista simple)
  // ──────────────────────────────────────────────
  function _renderModules(container, sub, data) {
    const wrapper = document.createElement("div");
    wrapper.className = "space-y-3";

    const grid = document.createElement("div");
    grid.className = "grid-2";
    grid.id = "mod23-grid";

    // Input oculto: cuántos módulos extra se han agregado
    const hiddenCount = document.createElement("input");
    hiddenCount.type = "hidden";
    hiddenCount.dataset.key = "__mod23_extra";
    const extraCount = parseInt(data["__mod23_extra"] || "0", 10);
    hiddenCount.value = String(extraCount);

    // Módulos base del modelo
    sub.keys.forEach((k, i) => {
      grid.appendChild(_makeModuleField(k, sub.labels[i], data[k] || ""));
    });

    // Módulos extra guardados
    for (let i = 0; i < extraCount; i++) {
      const num = sub.keys.length + i + 1;
      const key = `mod_extra_${i}`;
      grid.appendChild(_makeModuleField(key, `Módulo ${num}`, data[key] || ""));
    }

    wrapper.appendChild(hiddenCount);
    wrapper.appendChild(grid);

    // Botón Agregar Módulo
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.style.cssText = `
      display:inline-flex;align-items:center;gap:7px;
      padding:8px 18px;border-radius:9px;font-size:.82rem;font-weight:600;
      background:linear-gradient(135deg,#40916c,#2d6a4f);color:#fff;
      border:none;cursor:pointer;box-shadow:0 3px 10px rgba(45,106,79,.28);
      transition:filter .15s,transform .15s;
    `;
    addBtn.innerHTML = `
      <svg style="width:14px;height:14px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
      </svg>
      Agregar Módulo`;
    addBtn.addEventListener("mouseover", () => { addBtn.style.filter = "brightness(1.1)"; addBtn.style.transform = "translateY(-1px)"; });
    addBtn.addEventListener("mouseout",  () => { addBtn.style.filter = "";               addBtn.style.transform = ""; });
    addBtn.addEventListener("click", () => {
      const newExtra = parseInt(hiddenCount.value, 10) + 1;
      hiddenCount.value = String(newExtra);
      const num = sub.keys.length + newExtra;
      const key = `mod_extra_${newExtra - 1}`;
      const field = _makeModuleField(key, `Módulo ${num}`, "");
      grid.appendChild(field);
      field.querySelector("input").focus();
      grid.dispatchEvent(new Event("input", { bubbles: true }));
    });
    wrapper.appendChild(addBtn);

    container.appendChild(wrapper);
  }

  function _makeModuleField(key, label, value) {
    const div = document.createElement("div");
    div.innerHTML = `<label class="form-label">${label}</label>`;
    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "form-input";
    inp.dataset.key = key;
    inp.value = value;
    inp.placeholder = `Nombre del ${label}...`;
    div.appendChild(inp);
    return div;
  }

  // ──────────────────────────────────────────────
  // TABLA 3 COLUMNAS (tecnologías, licencias)
  // ──────────────────────────────────────────────
  function _renderTable3Col(container, sub, data) {
    const wrap = document.createElement("div");
    wrap.className = "overflow-x-auto";
    const tbl = document.createElement("table");
    tbl.className = "form-table";
    tbl.innerHTML = `<thead><tr>
      ${sub.headers.map(h => `<th>${h}</th>`).join("")}
    </tr></thead><tbody></tbody>`;

    const tbody = tbl.querySelector("tbody");
    sub.rows.forEach(row => {
      const tr = document.createElement("tr");
      const td0 = document.createElement("td");
      td0.className = "font-medium text-gray-700 w-1/3";
      td0.textContent = row.col0;

      const td1 = document.createElement("td");
      const inp1 = document.createElement("input");
      inp1.type = "text"; inp1.dataset.key = `${row.key}_col1`; inp1.value = data[`${row.key}_col1`] || "";
      td1.appendChild(inp1);

      const td2 = document.createElement("td");
      const inp2 = document.createElement("input");
      inp2.type = "text"; inp2.dataset.key = `${row.key}_col2`; inp2.value = data[`${row.key}_col2`] || "";
      td2.appendChild(inp2);

      tr.append(td0, td1, td2);
      tbody.appendChild(tr);
    });

    wrap.appendChild(tbl);
    container.appendChild(wrap);
  }

  // ──────────────────────────────────────────────
  // TABLA 2 COLUMNAS (seguridad)
  // ──────────────────────────────────────────────
  function _renderTable2Col(container, sub, data) {
    const wrap = document.createElement("div");
    wrap.className = "overflow-x-auto";
    const tbl = document.createElement("table");
    tbl.className = "form-table";
    tbl.innerHTML = `<thead><tr>
      ${sub.headers.map(h => `<th>${h}</th>`).join("")}
    </tr></thead><tbody></tbody>`;

    const tbody = tbl.querySelector("tbody");
    sub.rows.forEach(row => {
      const tr = document.createElement("tr");
      const td0 = document.createElement("td");
      td0.className = "font-medium text-gray-700 w-1/3";
      td0.textContent = row.col0;

      const td1 = document.createElement("td");
      const inp = document.createElement("input");
      inp.type = "text"; inp.dataset.key = row.key; inp.value = data[row.key] || "";
      td1.appendChild(inp);

      tr.append(td0, td1);
      tbody.appendChild(tr);
    });

    wrap.appendChild(tbl);
    container.appendChild(wrap);
  }

  // ──────────────────────────────────────────────
  // PASOS (6.7)
  // ──────────────────────────────────────────────
  function _renderSteps(container, sub, data) {
    const div = document.createElement("div");
    div.className = "space-y-2";
    sub.keys.forEach((k, i) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2";
      row.innerHTML = `<span class="shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">${i+1}</span>`;
      const inp = document.createElement("input");
      inp.type = "text"; inp.className = "form-input flex-1"; inp.dataset.key = k;
      inp.value = data[k] || ""; inp.placeholder = `Paso ${i+1}...`;
      row.appendChild(inp);
      div.appendChild(row);
    });
    container.appendChild(div);
  }

  // ──────────────────────────────────────────────
  // FASES (12.1)
  // ──────────────────────────────────────────────
  function _renderPhases(container, sub, data) {
    const div = document.createElement("div");
    div.className = "space-y-2";
    sub.keys.forEach((k, i) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2 flex-wrap";
      row.innerHTML = `<span class="shrink-0 text-sm font-semibold text-gray-600">Fase ${i+1}:</span>`;

      const inp1 = document.createElement("input");
      inp1.type = "text"; inp1.className = "form-input flex-1 min-w-0"; inp1.dataset.key = `${k}_nombre`;
      inp1.value = data[`${k}_nombre`] || ""; inp1.placeholder = "Nombre de la fase...";

      const inp2 = document.createElement("input");
      inp2.type = "number"; inp2.className = "form-input w-20 shrink-0"; inp2.dataset.key = `${k}_semanas`;
      inp2.value = data[`${k}_semanas`] || ""; inp2.placeholder = "Sem."; inp2.min = "1";

      const lbl = document.createElement("span");
      lbl.className = "text-xs text-gray-500 shrink-0";
      lbl.textContent = "semanas";

      row.append(inp1, inp2, lbl);
      div.appendChild(row);
    });
    container.appendChild(div);
  }

  // ──────────────────────────────────────────────
  // REQUERIMIENTOS FUNCIONALES (dinámicos)
  // ──────────────────────────────────────────────
  function _renderRFModules(container, section, data) {
    const wrapper = document.createElement("div");
    wrapper.className = "space-y-4";

    // Módulos definidos en el modelo
    section.modules.forEach(mod => {
      wrapper.appendChild(_renderRFModuleBlock({
        labelPrefix: mod.label,
        keyPrefix:   mod.keyPrefix,
        keyName:     mod.keyName || null,
        fixedName:   mod.fixedName || null,
        defaultCount: mod.count
      }, data));
    });

    // Módulos extra dinámicos (guardados en data)
    const extraCountKey = "__extra_mods_count";
    const extraCount = parseInt(data[extraCountKey] || "0", 10);
    for (let i = 1; i <= extraCount; i++) {
      const modNum = section.modules.length + i;
      wrapper.appendChild(_renderRFModuleBlock({
        labelPrefix:  `9.${modNum} Módulo de`,
        keyPrefix:    `rfEXT${i}`,
        keyName:      `rfEXT${i}_nombre`,
        fixedName:    null,
        defaultCount: 4
      }, data));
    }

    // Input oculto para contar módulos extra
    const hiddenExtra = document.createElement("input");
    hiddenExtra.type = "hidden";
    hiddenExtra.dataset.key = extraCountKey;
    hiddenExtra.value = String(extraCount);
    wrapper.appendChild(hiddenExtra);

    // Botón Agregar Módulo
    const addModBtn = document.createElement("button");
    addModBtn.type = "button";
    addModBtn.className = "flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors duration-150 shadow-sm mt-2";
    addModBtn.style.backgroundColor = "#2d6a4f";
    addModBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Agregar Módulo`;
    addModBtn.addEventListener("mouseover", () => { addModBtn.style.backgroundColor = "#1b4332"; });
    addModBtn.addEventListener("mouseout",  () => { addModBtn.style.backgroundColor = "#2d6a4f"; });
    addModBtn.addEventListener("click", () => {
      const newCount = parseInt(hiddenExtra.value || "0", 10) + 1;
      hiddenExtra.value = String(newCount);
      const modNum = section.modules.length + newCount;
      const block = _renderRFModuleBlock({
        labelPrefix:  `9.${modNum} Módulo de`,
        keyPrefix:    `rfEXT${newCount}`,
        keyName:      `rfEXT${newCount}_nombre`,
        fixedName:    null,
        defaultCount: 4
      }, {});
      wrapper.insertBefore(block, addModBtn);
      wrapper.dispatchEvent(new Event("input", { bubbles: true }));
      // Hacer scroll al nuevo bloque
      block.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    wrapper.appendChild(addModBtn);

    container.appendChild(wrapper);
  }

  // ──────────────────────────────────────────────
  // BLOQUE DE MÓDULO RF (reutilizable)
  // ──────────────────────────────────────────────
  function _renderRFModuleBlock(cfg, data) {
    const { labelPrefix, keyPrefix, keyName, fixedName, defaultCount } = cfg;
    const rfCountKey = `${keyPrefix}_rfcount`;
    const rfCount = parseInt(data[rfCountKey] || String(defaultCount), 10);

    const modDiv = document.createElement("div");
    modDiv.className = "bg-gray-50 rounded-lg border border-gray-200 p-4";

    // Header del módulo
    const mHeader = document.createElement("div");
    mHeader.className = "flex items-center gap-2 mb-3";

    if (!fixedName) {
      const lbl = document.createElement("span");
      lbl.className = "text-sm font-semibold text-gray-700 shrink-0";
      lbl.textContent = labelPrefix;
      mHeader.appendChild(lbl);
      const nameInp = document.createElement("input");
      nameInp.type = "text";
      nameInp.className = "form-input flex-1";
      nameInp.dataset.key = keyName;
      nameInp.value = data[keyName] || "";
      nameInp.placeholder = "Nombre del módulo...";
      mHeader.appendChild(nameInp);
    } else {
      const lbl = document.createElement("span");
      lbl.className = "text-sm font-semibold text-sena-green";
      lbl.textContent = labelPrefix;
      mHeader.appendChild(lbl);
    }
    modDiv.appendChild(mHeader);

    // Input oculto: contador de RFs de este módulo
    const hiddenRfCount = document.createElement("input");
    hiddenRfCount.type = "hidden";
    hiddenRfCount.dataset.key = rfCountKey;
    hiddenRfCount.value = String(rfCount);
    modDiv.appendChild(hiddenRfCount);

    // Contenedor de RF
    const rfContainer = document.createElement("div");
    rfContainer.className = "space-y-2 pl-2 border-l-2 border-green-200";
    for (let i = 1; i <= rfCount; i++) {
      rfContainer.appendChild(_makeRFRow(keyPrefix, i, data));
    }
    modDiv.appendChild(rfContainer);

    // Botón Agregar Requisito
    const addRfBtn = document.createElement("button");
    addRfBtn.type = "button";
    addRfBtn.className = "mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 transition-colors duration-150";
    addRfBtn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Agregar Requisito`;
    addRfBtn.addEventListener("click", () => {
      const newRfCount = parseInt(hiddenRfCount.value, 10) + 1;
      hiddenRfCount.value = String(newRfCount);
      const newRow = _makeRFRow(keyPrefix, newRfCount, {});
      rfContainer.appendChild(newRow);
      newRow.querySelector("input").focus();
      rfContainer.dispatchEvent(new Event("input", { bubbles: true }));
    });
    modDiv.appendChild(addRfBtn);

    return modDiv;
  }

  // ──────────────────────────────────────────────
  // FILA RF individual
  // ──────────────────────────────────────────────
  function _makeRFRow(keyPrefix, num, data) {
    const numStr = String(num).padStart(2, "0");
    const rfKey  = `${keyPrefix}_rf${numStr}`;
    const row = document.createElement("div");
    row.className = "flex items-center gap-2";

    const badge = document.createElement("span");
    badge.className = "rf-badge shrink-0";
    badge.textContent = `RF-${keyPrefix}-${numStr}`;

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "form-input flex-1";
    inp.dataset.key = rfKey;
    inp.value = data[rfKey] || "";
    inp.placeholder = `Descripción del requerimiento ${numStr}...`;

    row.append(badge, inp);
    return row;
  }

  // ──────────────────────────────────────────────
  // HISTORIAL DE MODIFICACIONES
  // ──────────────────────────────────────────────
  function _renderTableHistorial(container, section, data) {
    const wrap = document.createElement("div");
    wrap.className = "overflow-x-auto";
    const tbl = document.createElement("table");
    tbl.className = "form-table";
    tbl.innerHTML = `<thead><tr>
      ${section.headers.map(h => `<th>${h}</th>`).join("")}
    </tr></thead><tbody></tbody>`;

    const tbody = tbl.querySelector("tbody");
    for (let i = 0; i < section.rowCount; i++) {
      const tr = document.createElement("tr");
      [["v","Versión"],["f","Fecha"],["d","Descripción"],["r","Responsable"]].forEach(([sfx, ph]) => {
        const td = document.createElement("td");
        const inp = document.createElement("input");
        inp.type = sfx === "f" ? "date" : "text";
        inp.dataset.key = `${section.keyPrefix}_${sfx}${i}`;
        inp.value = data[`${section.keyPrefix}_${sfx}${i}`] || "";
        inp.placeholder = sfx !== "f" ? ph : "";
        td.appendChild(inp);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    wrap.appendChild(tbl);
    container.appendChild(wrap);
  }

  // ──────────────────────────────────────────────
  // APROBACIONES
  // ──────────────────────────────────────────────
  function _renderTableAprobaciones(container, section, data) {
    const wrap = document.createElement("div");
    wrap.className = "overflow-x-auto";
    const tbl = document.createElement("table");
    tbl.className = "form-table";
    tbl.innerHTML = `<thead><tr>
      ${section.headers.map(h => `<th>${h}</th>`).join("")}
    </tr></thead><tbody></tbody>`;

    const tbody = tbl.querySelector("tbody");
    section.rows.forEach(row => {
      const tr = document.createElement("tr");
      const td0 = document.createElement("td");
      td0.className = "font-semibold text-gray-700";
      td0.textContent = row.col0;

      [["_nombre","Nombre"],["_firma","Firma"],["_fecha",""]].forEach(([sfx, ph]) => {
        const td = document.createElement("td");
        const inp = document.createElement("input");
        inp.type = sfx === "_fecha" ? "date" : "text";
        inp.dataset.key = `${row.key}${sfx}`;
        inp.value = data[`${row.key}${sfx}`] || "";
        if (ph) inp.placeholder = ph;
        td.appendChild(inp);
        tr.appendChild(td);
      });

      tr.prepend(td0);
      tbody.appendChild(tr);
    });

    wrap.appendChild(tbl);
    container.appendChild(wrap);
  }

  // ──────────────────────────────────────────────
  // HELPER: crear input/select según tipo
  // ──────────────────────────────────────────────
  function _makeInput(field, data) {
    if (field.inputType === "select" && field.options) {
      const sel = document.createElement("select");
      sel.className = "form-select";
      sel.dataset.key = field.key;
      sel.innerHTML = `<option value="">-- Seleccionar --</option>` +
        field.options.map(o => `<option value="${_esc(o)}" ${data[field.key] === o ? "selected" : ""}>${_esc(o)}</option>`).join("");
      return sel;
    }

    if (field.inputType === "textarea") {
      const ta = document.createElement("textarea");
      ta.className = "form-textarea";
      ta.dataset.key = field.key;
      ta.value = data[field.key] || "";
      ta.placeholder = field.placeholder || "";
      return ta;
    }

    const inp = document.createElement("input");
    inp.type = field.inputType || "text";
    inp.className = "form-input";
    inp.dataset.key = field.key;
    inp.value = data[field.key] || "";
    inp.placeholder = field.placeholder || "";
    return inp;
  }

  // ──────────────────────────────────────────────
  // Recolectar todos los datos del DOM
  // ──────────────────────────────────────────────
  function collectData(container) {
    const data = {};
    container.querySelectorAll("[data-key]").forEach(el => {
      const key = el.dataset.key;
      if (el.tagName === "SELECT" || el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        data[key] = el.value;
      }
    });
    return data;
  }

  // ──────────────────────────────────────────────
  // Calcular progreso de llenado
  // ──────────────────────────────────────────────
  function calcProgress(container) {
    const all = container.querySelectorAll("[data-key]");
    let filled = 0;
    all.forEach(el => { if (el.value && el.value.trim()) filled++; });
    return all.length ? Math.round((filled / all.length) * 100) : 0;
  }

  // ──────────────────────────────────────────────
  // Utilidad: escape HTML
  // ──────────────────────────────────────────────
  function _esc(str) {
    return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  return { render, collectData, calcProgress };
})();
