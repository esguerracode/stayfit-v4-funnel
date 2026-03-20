# StayFit — Documentación Oficial del Proyecto

> **Versión**: 1.0.0  
> **Fecha**: Marzo 2026  
> **Mantenedor**: Juan David Rivar  
> **Estado**: En desarrollo activo

---

## Índice

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Catálogo de productos y precios](#4-catálogo-de-productos-y-precios)
5. [Métodos de pago](#5-métodos-de-pago)
6. [Flujo de venta](#6-flujo-de-venta)
7. [Integración WhatsApp Business](#7-integración-whatsapp-business)
8. [Bot de ventas n8n](#8-bot-de-ventas-n8n)
9. [Estado actual del proyecto](#9-estado-actual-del-proyecto)
10. [Roadmap pendiente](#10-roadmap-pendiente)
11. [Reglas de desarrollo](#11-reglas-de-desarrollo)
12. [Contacto y accesos](#12-contacto-y-accesos)

---

## 1. Descripción general

StayFit es una marca colombiana de suplementos naturales para pérdida de peso. El modelo de negocio es **D2C (Direct-to-Consumer)** a través de una landing page estática que deriva al cliente a un bot de WhatsApp donde se cierra la venta de forma automática.

**Objetivo del proyecto:** maximizar la tasa de conversión desde anuncios pagados (Meta/TikTok) hacia el flujo de cierre por WhatsApp, sin intervención humana en el proceso de venta.

---

## 2. Stack tecnológico

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Frontend | HTML5 + CSS3 + JS Vanilla | Sin frameworks. Archivo estático único. |
| Deploy | Archivo estático | Servido como `.html` directo o CDN |
| Automatización | n8n (self-hosted o cloud) | Flujo de cierre de venta por WhatsApp |
| Mensajería | WhatsApp Business API | Número: +57 310 329 6863 |
| Pagos | Bancolombia / Nequi / Bold | Sin pasarela integrada en landing |
| CLI de desarrollo | Claude Code | Herramienta principal de desarrollo |

> ⚠️ **Restricción crítica**: No se permite ningún framework JS (React, Vue, Angular, etc.) a menos que sea solicitado explícitamente por el cliente.

---

## 3. Estructura del proyecto

```
stayfit/
├── stayfit_landing.html        # Landing principal (dark theme) — COP
├── stayfit_landing_usd.html    # Versión USA en USD (pendiente)
├── stayfit_mayoristas.html     # Página de mayoristas (pendiente)
└── assets/
    └── (solo SVG inline o emojis — sin imágenes externas de stock)
```

### Secciones de la landing (en orden)

1. **Hero** — Titular principal, propuesta de valor, CTA a WhatsApp
2. **Productos** — Cards individuales (Pills / Tea) con precio y botón
3. **Combos** — Cards de combos con precio y botón
4. **Ingredientes** — Componentes naturales destacados
5. **Cómo funciona** — Proceso de 3–4 pasos
6. **Testimonios** — Social proof de clientes reales
7. **FAQ** — Preguntas frecuentes (envío, ingredientes, resultados)
8. **CTA Final** — Botón de cierre fuerte con urgencia

---

## 4. Catálogo de productos y precios

### Productos base

| Producto | Descripción | Precio COP | Precio USD |
|---------|-------------|-----------|-----------|
| StayFit Pills | Frasco 30 pastillas | $210.000 | $130 |
| StayFit Tea | Caja 15 sobres | $140.000 | $80 |

### Sabores disponibles — StayFit Tea

- 🍊 Naranja
- 🍍 Piña
- 🍓 Frutos Rojos
- 🍋 Limón
- 🍇 Uva

### Combos

| Combo | Contenido | Precio COP | Precio USD |
|-------|-----------|-----------|-----------|
| Combo 1 | Pills + Tea | $340.000 | $200 |
| Combo 2 | 2 Tés | $260.000 | $140 |
| Combo 3 | 3 Tés | $375.000 | $180 |

### Mayoristas

- Disponible desde **12 unidades**
- Precios negociados directamente por WhatsApp
- Contacto: +57 310 329 6863

### Logística

- **Tiempo de entrega**: 2–5 días hábiles
- **Costo de envío**: No incluido en el precio, se cobra aparte al confirmar pedido
- **Cobertura**: Nacional (Colombia) + envíos internacionales para versión USD

---

## 5. Métodos de pago

| Método | Datos | Titular |
|--------|-------|---------|
| Bancolombia | Cuenta 91289746078 | José Vicencio Cipagauta |
| Nequi | 3103296863 | Juan Rincón |
| Bold | Pago con tarjeta débito/crédito | — |

> Los datos de pago se comunican **por WhatsApp** durante el proceso de cierre. No se muestran en la landing directamente.

---

## 6. Flujo de venta

```
[Anuncio Meta/TikTok]
        ↓
[Landing Page stayfit_landing.html]
        ↓
[Botón "Comprar por WhatsApp" → wa.me link]
        ↓
[WhatsApp Business +57 310 329 6863]
        ↓
[Bot n8n: saludo → calificación → oferta → pago → confirmación]
        ↓
[Cliente realiza transferencia]
        ↓
[Bot confirma y registra pedido]
        ↓
[Despacho manual por parte del equipo]
```

### UTM Parameters (pendiente de implementar)

Todos los links de anuncios deben incluir:

```
?utm_source=meta&utm_medium=paid&utm_campaign=[nombre_campaña]&utm_content=[variante_creativo]
```

---

## 7. Integración WhatsApp Business

### Número oficial
```
+57 310 329 6863
```

### Formato del wa.me link

```
https://wa.me/573103296863?text=MENSAJE_PREESCRITO_URL_ENCODED
```

### Mensajes preescritos por producto (pre-llenado en botones de la landing)

| Botón | Mensaje preescrito |
|-------|-------------------|
| StayFit Pills | `Hola, quiero pedir StayFit Pills 💊` |
| StayFit Tea | `Hola, quiero pedir StayFit Tea 🍵` |
| Combo 1 | `Hola, quiero el Combo 1: Pills + Tea` |
| Combo 2 | `Hola, quiero el Combo 2: 2 Tés` |
| Combo 3 | `Hola, quiero el Combo 3: 3 Tés` |
| Mayoristas | `Hola, quiero información de precios mayoristas` |

---

## 8. Bot de ventas n8n

> ⚠️ **Estado**: Pendiente de implementación

### Objetivo del bot

Cerrar la venta de forma 100% automática desde el primer mensaje hasta la confirmación del pago, sin intervención humana.

### Nodos del flujo (diseño propuesto)

1. **Webhook Trigger** — Recibe mensaje entrante de WhatsApp Business API
2. **Switch (intención)** — Detecta producto mencionado en el mensaje inicial
3. **Mensaje de bienvenida** — Saludo personalizado + confirma producto de interés
4. **Selector de sabor** (solo si es Tea) — Pide elegir sabor con botones interactivos
5. **Captura de ciudad** — Pregunta ciudad para calcular envío
6. **Resumen del pedido** — Confirma producto, precio, ciudad y costo envío
7. **Envío datos de pago** — Envía Bancolombia / Nequi / Bold según preferencia del cliente
8. **Espera de comprobante** — Espera imagen de transferencia (timeout: 30 min)
9. **Validación manual / automática** — Confirma recibo de pago
10. **Confirmación de pedido** — Mensaje de gracias + tiempo de entrega estimado
11. **Registro en hoja de cálculo** — Google Sheets con datos del pedido

### Variables del bot

```
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
GOOGLE_SHEETS_ID=
N8N_WEBHOOK_URL=
```

---

## 9. Estado actual del proyecto

| Tarea | Estado |
|-------|--------|
| Landing page base (dark theme, todas las secciones) | ✅ Completada |
| Bot n8n: flujo de cierre de venta por WhatsApp | ⬜ Pendiente |
| Integración UTM / tracking de conversiones | ⬜ Pendiente |
| Versión USA en USD (`stayfit_landing_usd.html`) | ⬜ Pendiente |
| Página de mayoristas | ⬜ Pendiente |
| Optimización SEO / velocidad | ⬜ Pendiente |
| Tests A/B de CTAs | ⬜ Pendiente |

---

## 10. Roadmap pendiente

### Prioridad alta
- [ ] Construir flujo n8n completo con los 11 nodos descritos
- [ ] Agregar parámetros UTM en todos los botones de la landing
- [ ] Conectar Google Sheets para registro de pedidos

### Prioridad media
- [ ] Crear versión USD para mercado estadounidense
- [ ] Crear página de mayoristas con formulario de contacto
- [ ] Instalar Google Analytics 4 o Meta Pixel

### Prioridad baja
- [ ] Tests A/B: variantes de headline en el Hero
- [ ] Optimización de velocidad (minificación CSS/JS inline)
- [ ] SEO on-page: meta tags, Open Graph, schema.org

---

## 11. Reglas de desarrollo

1. **Sin frameworks JS** — Solo HTML + CSS + JS vanilla
2. **Sin imágenes externas** — Solo emojis o SVG inline
3. **Archivo único** — Todo el CSS y JS va inline en el `.html`
4. **Dark theme** — Paleta base definida en `:root` con variables CSS
5. **Mobile-first** — Breakpoint principal a 768px
6. **Botones WhatsApp** — Todo CTA abre `wa.me` en `target="_blank"`
7. **Sin dependencias de instalación** — Compatible con Claude Code out of the box
8. **Idioma** — Español colombiano en todos los copies

### Variables CSS base

```css
:root {
  --bg: #0a0a0a;
  --surface: #141414;
  --accent: #ff4d82;
  --text: #ffffff;
  --text-muted: #999999;
}
```

---

## 12. Contacto y accesos

| Rol | Nombre | Contacto |
|-----|--------|---------|
| Cliente / Dueño del proyecto | Juan David Rivar | WhatsApp +57 310 329 6863 |
| Número WhatsApp Business | — | +57 310 329 6863 |
| Bancolombia (pagos) | José Vicencio Cipagauta | Cuenta 91289746078 |
| Nequi (pagos) | Juan Rincón | 3103296863 |

---

*Documentación generada el 20 de marzo de 2026. Actualizar con cada sprint completado.*
