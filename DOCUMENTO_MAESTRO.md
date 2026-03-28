# 📗 STAYFIT — DOCUMENTACIÓN TÉCNICA MAESTRA (v2.1.0)

> **Rol**: Fuente única de verdad para el desarrollo, mantenimiento y replicación del ecosistema StayFit. 
> **Audiencia**: Desarrolladores Senior, Arquitectos de Automatización.

---

## 1. Arquitectura del Sistema
StayFit utiliza un patrón de **"Conversión Híbrida Estática"**. El frontend es 100% agnóstico de frameworks (Vanilla Stack) para maximizar el performance (LCP < 0.8s), delegando la persistencia y el procesamiento de órdenes a un backend de automatización (n8n) vía WhatsApp.

### 📂 Estructura de Archivos (Core)
```text
/StayFit
├── index.html                 # Landing Page Principal
├── stayfit_landing_usd.html   # Variación para mercado USA/Global
├── stayfit_mayoristas.html    # Variación para canal B2B
├── checkout.js                # Lógica de Modal, Checkout y WhatsApp Payload
├── stayfit-conversion.js      # Motor de Atribución, Moneda y Componentes UI
├── globals.css                # Sistema de diseño, Tokens y Media Queries
├── vercel.json                # Configuración de Routing y Seguridad
└── Media/                     # Assets optimizados (WebP/SVG)
```

---

## 2. Motores Lógicos (JS Deep Dive)

### 2.1 Motor de Atribución (`stayfit-conversion.js`)
Implementa persistencia de primer contacto usando `localStorage`.

- **Atributos capturados**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`.
- **Key Prefix**: `sf_` (ej. `sf_utm_source`).
- **Función de Atribución**: `getUTMSuffix()` genera el string de tracking que se adjunta al payload de WhatsApp.

### 2.2 Sistema de Moneda Dual (COP/USD)
El sistema no es solo visual; sincroniza el estado global a través del DOM y el almacenamiento local.

- **Trigger**: Botón `#currency-toggle`.
- **Estado Global**: `document.body.setAttribute('data-currency', 'USD|COP')`.
- **Sincronización de Precios**: Los elementos con el atributo `[data-amount-cop]` se actualizan dinámicamente mediante la función `updatePrices()`.
- **Tasa de Cambio**: Definida en constante `EXCHANGE_RATE` (Default: 4000).

### 2.3 Motor de Checkout (`checkout.js`)
Gestiona el ciclo de vida del modal de compra y la estructuración del payload.

- **Catálogo de Precios**: Objeto centralizado `PRICES` con mapeo de `SKU -> Valor (COP)`.
- **Accesibilidad (WCAG 2.1)**: Función `trapFocus()` para asegurar navegación por teclado circular dentro del modal.
- **Detección de Producto**: Función `isTea(name)` para habilitar/deshabilitar condicionalmente el selector de sabores.

---

## 3. Payload de Salida (WhatsApp Business API)
El sistema genera un mensaje estructurado y codificado (URL Encoding) que actúa como un Webhook hacia n8n.

**Estructura del Mensaje:**
```text
🛍️ *ORDEN PENDIENTE STAYFIT*
📦 *Producto:* {data.product}
🍵 *Sabor:* {data.flavor} (Solo si es Té)
🔢 *Cantidad:* {qty}
💰 *Total:* {totalFormatted}
👤 *Cliente:* {data.name}
📱 *WhatsApp:* {countryCode} {phone}
🏠 *Dirección:* {data.address}
📍 *Origen:* {data.country}
💳 *Preferencia:* {currency}
[Atribución: source/medium - campaign]
```

---

## 4. Diseño y Estilos (Design System)
Basado en variables CSS (`:root`) para facilitar el re-branding rápido.

| Variable | Uso |
| :--- | :--- |
| `--apple-bg` | Fondo base (Primario) |
| `--pills-color` | Color acento (Primario) |
| `--glass-bg` | RGBA para efectos de desenfoque |
| `--radius-lg` | Border-radius estándar (20px) |

---

## 5. Glosario de Atributos de Datos (Data Attributes)
El sistema utiliza el DOM como "Single Source of Truth" para el estado de la UI.

| Atributo | Elemento | Función |
| :--- | :--- | :--- |
| `data-currency` | `<body>` | Controla el símbolo y cálculo de precios global (`USD`\|`COP`). |
| `data-theme` | `<body>` | Define el esquema de color activo (`light`\|`dark`). |
| `data-amount-cop` | `<any>` | Almacena el precio base en pesos para recálculo dinámico. |
| `data-amount-usd` | `<any>` | Almacena el precio base en dólares (opcional, si difiere del cálculo automático). |
| `data-open-modal` | `<button>` | Trigger para inicializar el motor de checkout. |
| `data-product` | `<button>` | Inyecta el nombre del SKU al contexto del modal. |

---

## 6. Guía de Mantenimiento para Desarrolladores

### Actualizar Precios
Modificar el objeto `PRICES` en `checkout.js` (L57-64). Los precios deben estar en COP (entero sin puntos).

### Añadir un Nuevo Producto
1. Crear el trigger en el HTML: `<button data-open-modal data-product="Nombre Exacto">`.
2. El nombre debe coincidir EXACTAMENTE con la llave en el objeto `PRICES`.

### Configurar n8n Webhook
El sistema espera que un bot de WhatsApp reciba el mensaje. Para integrar con una base de datos:
1. Configurar un nodo **Webhook** (o recibir vía IA Agent).
2. Parsear el string usando Regex para extraer los campos `Producto`, `Cantidad` y `Atribución`.

---

## 6. Configuración de Despliegue (DevOps)
Archivo `vercel.json` implementado para:
- **Rewrites**: Mapeo de `/usd` y `/mayoristas` a archivos físicos específicos.
- **Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- **Performance**: Caching agresivo de assets en `/Media/`.

---
*Documento mantenido mediante el flujo AntiGravity. Versión 2.1.0 (Technical Release).*
