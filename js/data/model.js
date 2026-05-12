/**
 * CAPA DE DATOS – model.js
 * Define la estructura completa de la ficha técnica SENA.
 * Cada sección tiene: id, número, título, tipo de contenido y campos.
 */

const FichaTecnicaModel = {

  meta: {
    ficha: "",
    fecha: ""
  },

  sections: [
    {
      id: "info-general",
      num: "1",
      title: "Información General del Proyecto",
      type: "table-kv",
      rows: [
        { key: "nombre_producto",    label: "Nombre del producto" },
        { key: "responsables",       label: "Responsables del proyecto" },
        { key: "linea_produccion",   label: "Línea de producción" },
        { key: "versiones_ant",      label: "Versiones anteriores" },
        { key: "version_actual",     label: "Versión actual" },
        { key: "fecha_inicio",       label: "Fecha de inicio",  inputType: "date" },
        { key: "estado",             label: "Estado del proyecto",
          inputType: "select",
          options: ["En planificación","En desarrollo","En pruebas","En producción","Suspendido","Finalizado"] }
      ]
    },
    {
      id: "caracteristicas",
      num: "2",
      title: "Características del Producto",
      type: "mixed",
      subsections: [
        { id: "descripcion", label: "2.1 Descripción General", key: "descripcion_general", type: "textarea",
          placeholder: "Describa de manera general el producto de software..." },
        { id: "objetivo",    label: "2.2 Objetivo",            key: "objetivo",           type: "textarea",
          placeholder: "Describa el objetivo principal del proyecto..." },
        {
          id: "modulos", label: "2.3 Módulos del Sistema", type: "modules",
          count: 9,
          keys: ["mod1","mod2","mod3","mod4","mod5","mod6","mod7","mod8","mod9"],
          labels: ["Módulo 1","Módulo 2","Módulo 3","Módulo 4","Módulo 5","Módulo 6","Módulo 7","Módulo 8","Módulo 9"]
        }
      ]
    },
    {
      id: "arquitectura",
      num: "3",
      title: "Arquitectura del Sistema",
      type: "mixed",
      subsections: [
        {
          id: "arq-general", label: "3.1 Arquitectura General", type: "fields",
          fields: [
            { key: "arq_tipo",         label: "Tipo",          placeholder: "ej. Monolítica, Microservicios, Serverless..." },
            { key: "arq_enfoque",      label: "Enfoque",       placeholder: "ej. MVC, Clean Architecture, Hexagonal..." },
            { key: "arq_organizacion", label: "Organización",  placeholder: "ej. N-Capas, Modular..." }
          ]
        },
        {
          id: "tecnologias", label: "3.2 Tecnologías Utilizadas", type: "table-3col",
          headers: ["Área", "Tecnología", "Versión"],
          rows: [
            { key: "tech_lang",       col0: "Lenguaje de programación" },
            { key: "tech_backend",    col0: "Framework backend" },
            { key: "tech_frontend",   col0: "Frontend" },
            { key: "tech_templates",  col0: "Motor de plantillas" },
            { key: "tech_db",         col0: "Base de datos" },
            { key: "tech_webserver",  col0: "Servidor web" },
            { key: "tech_vcs",        col0: "Control de versiones" },
            { key: "tech_containers", col0: "Contenedores" },
            { key: "tech_hosting",    col0: "Hosting/Cloud" },
            { key: "tech_panel",      col0: "Panel de control" }
          ]
        }
      ]
    },
    {
      id: "requisitos",
      num: "4",
      title: "Requisitos del Sistema",
      type: "mixed",
      subsections: [
        {
          id: "req-servidor", label: "4.1 Requisitos del Servidor (Cloud Hosting)", type: "fields-group",
          groups: [
            {
              label: "4.1.1 Proveedor de Hosting",
              fields: [
                { key: "host_proveedor", label: "Proveedor" },
                { key: "host_tipo",      label: "Tipo",
                  inputType: "select", options: ["VPS","Dedicado","Compartido","Cloud","Serverless","PaaS","IaaS"] },
                { key: "host_ubicacion", label: "Ubicación (región/datacenter)" },
                { key: "host_sla",       label: "Garantía de disponibilidad (SLA)" }
              ]
            },
            {
              label: "4.1.2 Configuración Recomendada",
              fields: [
                { key: "srv_plan",       label: "Plan" },
                { key: "srv_cpu",        label: "Procesador" },
                { key: "srv_ram",        label: "Memoria RAM" },
                { key: "srv_storage",    label: "Almacenamiento" },
                { key: "srv_bandwidth",  label: "Ancho de banda" },
                { key: "srv_price",      label: "Precio estimado" }
              ]
            },
            {
              label: "4.1.3 Características Técnicas",
              fields: [
                { key: "srv_hardware",     label: "Hardware" },
                { key: "srv_almacen",      label: "Almacenamiento (tipo)" },
                { key: "srv_escalabilidad",label: "Escalabilidad" },
                { key: "srv_backup",       label: "Backup" },
                { key: "srv_seguridad",    label: "Seguridad" },
                { key: "srv_soporte",      label: "Soporte" }
              ]
            },
            {
              label: "4.1.4 Software del Servidor",
              fields: [
                { key: "sw_so",         label: "Sistema operativo" },
                { key: "sw_lang",       label: "Lenguaje" },
                { key: "sw_framework",  label: "Framework" },
                { key: "sw_db",         label: "Base de datos" },
                { key: "sw_webserver",  label: "Servidor web" },
                { key: "sw_containers", label: "Contenedores" },
                { key: "sw_panel",      label: "Panel de control" }
              ]
            },
            {
              label: "4.1.5 Características Adicionales",
              fields: [
                { key: "add_dominio",   label: "Dominio" },
                { key: "add_ssl",       label: "Certificados SSL" },
                { key: "add_monitor",   label: "Monitoreo" },
                { key: "add_balancer",  label: "Balanceador de carga" },
                { key: "add_billing",   label: "Facturación" },
                { key: "add_trial",     label: "Prueba gratuita" }
              ]
            }
          ]
        },
        {
          id: "req-cliente", label: "4.2 Requisitos del Sistema (Cliente)", type: "fields-group",
          groups: [
            {
              label: "4.2.1 Hardware",
              fields: [
                { key: "cli_cpu",         label: "Procesador" },
                { key: "cli_ram",         label: "Memoria RAM" },
                { key: "cli_storage",     label: "Almacenamiento" },
                { key: "cli_pantalla",    label: "Pantalla" },
                { key: "cli_conectividad",label: "Conectividad" }
              ]
            },
            {
              label: "4.2.2 Software",
              fields: [
                { key: "cli_so",       label: "Sistema operativo" },
                { key: "cli_browser",  label: "Navegador" },
                { key: "cli_js",       label: "JavaScript",
                  inputType: "select", options: ["Requerido","Opcional","No requerido"] },
                { key: "cli_cookies",  label: "Cookies",
                  inputType: "select", options: ["Requeridas","Opcionales"] }
              ]
            },
            {
              label: "4.2.3 Otros",
              fields: [
                { key: "cli_printer",  label: "Impresora" },
                { key: "cli_barcode",  label: "Lector código de barras" },
                { key: "cli_webcam",   label: "Cámara web" },
                { key: "cli_internet", label: "Acceso a internet" }
              ]
            },
            {
              label: "4.2.4 Acceso Remoto y Cloud",
              fields: [
                { key: "cli_https",   label: "Conexión segura (HTTPS)" },
                { key: "cli_vpn",     label: "VPN" },
                { key: "cli_mobile",  label: "Acceso móvil" },
                { key: "cli_sync",    label: "Sincronización" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "licencias",
      num: "5",
      title: "Licencias y Costos",
      type: "mixed",
      subsections: [
        {
          id: "lic-table", label: "Tabla de Licencias", type: "table-3col",
          headers: ["Componente","Licencia","Costo"],
          rows: [
            { key: "lic_lang",       col0: "Lenguaje de programación" },
            { key: "lic_framework",  col0: "Framework" },
            { key: "lic_db",         col0: "Base de datos" },
            { key: "lic_so",         col0: "Sistema operativo" },
            { key: "lic_webserver",  col0: "Servidor web" },
            { key: "lic_containers", col0: "Contenedores" },
            { key: "lic_hosting",    col0: "Hosting Cloud" },
            { key: "lic_panel",      col0: "Panel de control" },
            { key: "lic_dominio",    col0: "Dominio" },
            { key: "lic_ssl",        col0: "SSL Certificate" },
            { key: "lic_backup",     col0: "Backup adicional" }
          ]
        },
        {
          id: "costos", label: "5.1 Costos Estimados del Proyecto", type: "fields-group",
          groups: [
            {
              label: "5.1.1 Costos Mensuales",
              fields: [
                { key: "cost_hosting_mes",  label: "Hosting Cloud" },
                { key: "cost_backup_mes",   label: "Backup automático" },
                { key: "cost_panel_mes",    label: "Panel de control" },
                { key: "cost_total_mes",    label: "Total mensual" }
              ]
            },
            {
              label: "5.1.2 Costos Anuales",
              fields: [
                { key: "cost_dominio_year",  label: "Dominio" },
                { key: "cost_hosting_year",  label: "Hosting (12 meses)" },
                { key: "cost_backup_year",   label: "Backup (12 meses)" },
                { key: "cost_total_year",    label: "Total anual" }
              ]
            },
            {
              label: "5.1.3 Costos de Desarrollo",
              fields: [
                { key: "cost_dev",       label: "Desarrollo inicial" },
                { key: "cost_training",  label: "Capacitación" },
                { key: "cost_maint",     label: "Mantenimiento anual" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "proveedor",
      num: "6",
      title: "Proveedor de Hosting",
      type: "mixed",
      subsections: [
        { id: "prov-info", label: "6.1 Información General", key: "prov_info", type: "textarea",
          placeholder: "Describa el proveedor de hosting seleccionado..." },
        {
          id: "prov-infra", label: "6.2 Características Técnicas", type: "fields-group",
          groups: [
            {
              label: "6.2.1 Infraestructura",
              fields: [
                { key: "prov_cpu",    label: "Procesadores" },
                { key: "prov_storage",label: "Almacenamiento" },
                { key: "prov_red",    label: "Red" },
                { key: "prov_escala", label: "Escalabilidad" }
              ]
            },
            {
              label: "6.2.2 Sistemas Operativos Disponibles",
              fields: [
                { key: "prov_so1", label: "SO 1" },
                { key: "prov_so2", label: "SO 2" },
                { key: "prov_so3", label: "SO 3" },
                { key: "prov_so4", label: "SO 4" }
              ]
            },
            {
              label: "6.2.3 Paneles de Control",
              fields: [
                { key: "prov_panel1", label: "Panel 1" },
                { key: "prov_panel2", label: "Panel 2" },
                { key: "prov_panel3", label: "Panel 3" },
                { key: "prov_panel4", label: "Panel 4" }
              ]
            }
          ]
        },
        {
          id: "prov-precios", label: "6.3 Modelo de Precios", type: "fields",
          fields: [
            { key: "prov_billing",    label: "Facturación flexible" },
            { key: "prov_payuse",     label: "Pago por uso" },
            { key: "prov_nocommit",   label: "Sin compromisos" },
            { key: "prov_extracost",  label: "Costos adicionales" }
          ]
        },
        {
          id: "prov-soporte", label: "6.4 Soporte y Servicios", type: "fields",
          fields: [
            { key: "prov_support",  label: "Soporte técnico" },
            { key: "prov_managed",  label: "Servicios gestionados" },
            { key: "prov_trial",    label: "Prueba gratuita" },
            { key: "prov_config",   label: "Configuración" }
          ]
        },
        {
          id: "prov-seguridad", label: "6.5 Seguridad y Confiabilidad", type: "fields",
          fields: [
            { key: "prov_ddos",     label: "Protección DDoS" },
            { key: "prov_backup",   label: "Backup automático" },
            { key: "prov_monitor",  label: "Monitoreo" },
            { key: "prov_privacy",  label: "Privacidad" }
          ]
        },
        {
          id: "prov-ventajas", label: "6.6 Ventajas para el Proyecto", type: "fields",
          fields: [
            { key: "prov_v1", label: "Escalabilidad" },
            { key: "prov_v2", label: "Ubicación global" },
            { key: "prov_v3", label: "Costo-efectivo" },
            { key: "prov_v4", label: "Flexibilidad" },
            { key: "prov_v5", label: "Confiabilidad" }
          ]
        },
        {
          id: "prov-impl", label: "6.7 Proceso de Implementación", type: "steps",
          count: 7,
          keys: ["prov_step1","prov_step2","prov_step3","prov_step4","prov_step5","prov_step6","prov_step7"]
        }
      ]
    },
    {
      id: "recursos",
      num: "7",
      title: "Recursos Tecnológicos",
      type: "mixed",
      subsections: [
        { id: "rec-fisicos",  label: "7.1 Recursos Físicos",  key: "rec_fisicos",  type: "textarea",
          placeholder: "Liste los recursos físicos requeridos..." },
        { id: "rec-digitales",label: "7.2 Recursos Digitales", key: "rec_digitales", type: "textarea",
          placeholder: "Liste los recursos digitales requeridos..." }
      ]
    },
    {
      id: "seguridad",
      num: "8",
      title: "Aspectos de Seguridad",
      type: "mixed",
      subsections: [
        {
          id: "seg-table", label: "8.1 Tabla de Seguridad", type: "table-2col",
          headers: ["Aspecto","Implementación"],
          rows: [
            { key: "seg_auth",    col0: "Autenticación" },
            { key: "seg_authz",   col0: "Autorización" },
            { key: "seg_valid",   col0: "Validación" },
            { key: "seg_cipher",  col0: "Cifrado" },
            { key: "seg_backup",  col0: "Backups" },
            { key: "seg_audit",   col0: "Auditoría" },
            { key: "seg_2fa",     col0: "2FA" },
            { key: "seg_captcha", col0: "Captcha" },
            { key: "seg_firewall",col0: "Firewall" },
            { key: "seg_ddos",    col0: "DDoS Protection" },
            { key: "seg_monitor", col0: "Monitoreo" },
            { key: "seg_updates", col0: "Actualizaciones" }
          ]
        },
        {
          id: "seg-cloud", label: "8.2 Seguridad de Infraestructura Cloud", type: "fields",
          fields: [
            { key: "seg_physical",   label: "Seguridad física" },
            { key: "seg_privnet",    label: "Redes privadas" },
            { key: "seg_ids",        label: "Prevención de intrusos" },
            { key: "seg_compliance", label: "Cumplimiento" },
            { key: "seg_redundancy", label: "Redundancia" },
            { key: "seg_isolation",  label: "Aislamiento" },
            { key: "seg_access",     label: "Acceso controlado" }
          ]
        }
      ]
    },
    {
      id: "req-funcionales",
      num: "9",
      title: "Requerimientos Funcionales",
      type: "rf-modules",
      modules: [
        { id: "rf-mod1",  label: "9.1 Módulo de", keyPrefix: "rf1",  keyName: "rf1_nombre",  count: 6 },
        { id: "rf-mod2",  label: "9.2 Módulo de", keyPrefix: "rf2",  keyName: "rf2_nombre",  count: 6 },
        { id: "rf-mod3",  label: "9.3 Módulo de", keyPrefix: "rf3",  keyName: "rf3_nombre",  count: 4 },
        { id: "rf-mod4",  label: "9.4 Módulo de", keyPrefix: "rf4",  keyName: "rf4_nombre",  count: 4 },
        { id: "rf-mod5",  label: "9.5 Módulo de", keyPrefix: "rf5",  keyName: "rf5_nombre",  count: 5 },
        { id: "rf-mod6",  label: "9.6 Módulo de", keyPrefix: "rf6",  keyName: "rf6_nombre",  count: 5 },
        { id: "rf-mod7",  label: "9.7 Módulo de", keyPrefix: "rf7",  keyName: "rf7_nombre",  count: 4 },
        { id: "rf-seg",   label: "9.8 Módulo de Seguridad", keyPrefix: "rfSEG", fixedName: "Seguridad", count: 12 },
        { id: "rf-aud",   label: "9.9 Módulo de Auditoría", keyPrefix: "rfAUD", fixedName: "Auditoría", count: 4 },
        { id: "rf-rep",   label: "9.10 Módulo de Reportes", keyPrefix: "rfREP", fixedName: "Reportes",  count: 5 },
        { id: "rf-cld",   label: "9.11 Módulo de Cloud y Escalabilidad", keyPrefix: "rfCLD", fixedName: "Cloud", count: 6 }
      ]
    },
    {
      id: "req-no-funcionales",
      num: "10",
      title: "Requerimientos No Funcionales",
      type: "mixed",
      subsections: [
        { id: "rnf-rendimiento",    label: "10.1 Rendimiento",    key: "rnf_rendimiento",    type: "textarea", placeholder: "Ej: Tiempo de respuesta < 2s, soporte para N usuarios concurrentes..." },
        { id: "rnf-usabilidad",     label: "10.2 Usabilidad",     key: "rnf_usabilidad",     type: "textarea", placeholder: "Ej: Interfaz responsiva, accesibilidad WCAG 2.1..." },
        { id: "rnf-escalabilidad",  label: "10.3 Escalabilidad",  key: "rnf_escalabilidad",  type: "textarea", placeholder: "Ej: Escalado horizontal automático, balanceo de carga..." },
        { id: "rnf-mantenibilidad", label: "10.4 Mantenibilidad", key: "rnf_mantenibilidad", type: "textarea", placeholder: "Ej: Código documentado, pruebas unitarias, CI/CD..." }
      ]
    },
    {
      id: "justificacion",
      num: "11",
      title: "Justificación Técnica y Económica",
      type: "mixed",
      subsections: [
        { id: "just-tecnica",   label: "11.1 Justificación Técnica",   key: "just_tecnica",   type: "textarea", placeholder: "Argumente la selección de tecnologías..." },
        { id: "just-economica", label: "11.2 Justificación Económica", key: "just_economica", type: "textarea", placeholder: "Justifique los costos y la inversión del proyecto..." }
      ]
    },
    {
      id: "plan-impl",
      num: "12",
      title: "Plan de Implementación",
      type: "mixed",
      subsections: [
        {
          id: "fases", label: "12.1 Fases del Proyecto", type: "phases",
          count: 5,
          keys: ["fase1","fase2","fase3","fase4","fase5"]
        },
        { id: "entregables", label: "12.2 Entregables", key: "entregables", type: "textarea",
          placeholder: "Liste los entregables del proyecto (uno por línea)..." }
      ]
    },
    {
      id: "clientes",
      num: "13",
      title: "Clientes del Producto",
      type: "fields",
      fields: [
        { key: "cliente1", label: "Tipo de cliente 1" },
        { key: "cliente2", label: "Tipo de cliente 2" },
        { key: "cliente3", label: "Tipo de cliente 3" },
        { key: "cliente4", label: "Tipo de cliente 4" },
        { key: "cliente5", label: "Tipo de cliente 5" }
      ]
    },
    {
      id: "consideraciones",
      num: "14",
      title: "Consideraciones Adicionales",
      type: "mixed",
      subsections: [
        { id: "integracion",  label: "14.1 Integración con Sistemas Externos", key: "integracion",  type: "textarea", placeholder: "APIs, sistemas legacy, integraciones externas..." },
        { id: "caracteristicas-esp", label: "14.2 Características Especiales", key: "caract_esp",  type: "textarea", placeholder: "Funcionalidades especiales, restricciones técnicas..." },
        { id: "soporte-mant", label: "14.3 Soporte y Mantenimiento",          key: "soporte_mant", type: "textarea", placeholder: "Políticas de soporte, SLA, canales de atención..." }
      ]
    },
    {
      id: "historial",
      num: "15",
      title: "Historial de Modificaciones",
      type: "table-historial",
      headers: ["Versión","Fecha","Descripción","Responsable"],
      rowCount: 5,
      keyPrefix: "hist"
    },
    {
      id: "aprobaciones",
      num: "16",
      title: "Aprobaciones",
      type: "table-aprobaciones",
      headers: ["Rol","Nombre","Firma","Fecha"],
      rows: [
        { key: "apro_elaboro", col0: "Elaboró" },
        { key: "apro_reviso",  col0: "Revisó" },
        { key: "apro_aprobo",  col0: "Aprobó" }
      ]
    },
    {
      id: "notas",
      num: "✎",
      title: "Notas Adicionales",
      type: "textarea-single",
      key: "notas_adicionales",
      placeholder: "Espacio para notas adicionales, comentarios o información relevante..."
    }
  ]
};
