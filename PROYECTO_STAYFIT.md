# StayFit - Proyecto Landing Page E-commerce

> **Última actualización:** Abril 2026
> **Estado:** En desarrollo activo

---

## 📋 Resumen del Proyecto

StayFit es una marca colombiana de suplementos naturales para pérdida de peso (Pills + Tea). Modelo de negocio **D2C (Direct-to-Consumer)** con cierre de ventas por **WhatsApp Business**.

| Aspecto | Detalle |
|---------|---------|
| **URL producción** | stayfit.co |
| **Stack** | HTML5 + CSS3 + JS Vanilla (sin frameworks) |
| **Deploy** | Vercel / CDN estático |
| **Automatización** | n8n (bot de ventas WhatsApp) |
| **WhatsApp** | +57 310 329 6863 |

---

## 🗂 Estructura del Proyecto

```
StayFit - Final/
├── index.html                    # Landing principal (COP)
├── stayfit_tea.html              # Landing producto Tea
├── stayfit_pills.html            # Landing producto Pills
├── stayfit_mayoristas.html       # Página mayoristas
├── stayfit_landing_usd.html      # Versión USD
├── globals.css                   # Estilos globales
├── robots.txt                    # SEO crawler config
├── sitemap.xml                   # Mapa del sitio
├── src/
│   ├── main.js                  # Entry point ESM
│   └── modules/
│       ├── animations.js        # Animaciones de conversión
│       ├── attribution.js       # Tracking UTM
│       ├── billing.js           # Cambios moneda COP/USD
│       ├── config.js            # Configuración global
│       ├── loader.js            # Page loader
│       ├── sliders.js           # Selector de sabores Tea
│       ├── storage.js           # LocalStorage wrapper
│       ├── ui-engine.js         # UI, modales, reveal
│       └── whatsapp.js          # CTAs WhatsApp
├── Media/
│   ├── Logos/                   # Logo SVG/PNG
│   ├── Fotos de producto/       # Imágenes productos
│   ├── Fotos publicitarias/     # Testimonios
│   └── Avatars/                 # Avatars clientes
└── Documentacion/
    ├── STAYFIT_PROJECT_DOCS.md  # Docs originales
    └── Informacion cliente.md   # Info del cliente
```

---

## 🎯 Catálogo de Productos

### Productos Base

| Producto | Precio COP | Precio USD |
|----------|-----------|-------------|
| StayFit Pills (30 caps) | $210.000 | $130 |
| StayFit Tea (15 sobres) | $140.000 | $80 |

### Sabores Tea
Naranja • Piña • Frutos Rojos • Uva • Limón

### Combos

| Combo | Contenido | Precio COP | Precio USD |
|-------|-----------|-----------|-------------|
| Combo 1: Mix Inicial | Pills + Tea | $340.000 | $200 |
| Combo 2: Dúo Poder | 2 Tés | $260.000 | $140 |
| Combo 3: Máximo Detox | 3 Tés | $375.000 | $180 |

---

## 💳 Métodos de Pago

| Método | Datos | Titular |
|--------|-------|---------|
| Bancolombia | Cuenta 91289746078 | José Vicencio Cipagauta |
| Nequi | 3103296863 | Juan Rincón |
| Bold | Tarjeta débito/crédito | — |

---

## 🔗 Flujo de Venta

```
Anuncio (Meta/TikTok)
        ↓
Landing Page (stayfit.co)
        ↓
CTA "Comprar ahora" → WhatsApp
        ↓
Bot n8n: Saludo → Calificación → Oferta → Pago → Confirmación
        ↓
Cliente realiza transferencia
        ↓
Confirmación + Despacho
```

---

## 🎨 Diseño Implementado

### Tipografía
- **Fuente:** Poppins (sans serie)
- **Reemplazó:** Inter + Outfit

### Sistema de Colores
- Primary: `#7B2CBF` (Púrpura vibrante)
- Dark: `#1A122E` (Fondo secciones)
- Fondos por sección con gradientes diferenciados

### Animaciones
- Page loader con logo animado
- Header con entrada secuencial
- Scroll reveal en todas las secciones
- Hover effects en cards
- Botón distribuidor mejorado

### Secciones Landing (Orden embudo)
1. **Hero** - CTA directo "Comprar ahora"
2. **Productos** - Pills + Tea con botones WhatsApp
3. **Combos** - 3 opciones con CTA directo
4. **Beneficios** - Trust badges (envío, pago, natural, asesoría)
5. **Testimonios** - Social proof
6. **FAQ** - 6 preguntas objeciones comunes
7. **CTA Final** - Botón directa compra
8. **Distribuidor** - Sección colapsable

---

## 🔧 Comandos de Desarrollo

```bash
# Servidor local (puerto 3001)
npx serve -p 3001

# O usando el servidor incluido
node .tmp_server.js
```

**URL local:** http://localhost:3001/

---

## 📊 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Landing principal con todo el embudo |
| `globals.css` | Estilos, variables CSS, animaciones |
| `src/modules/animations.js` | Animaciones de conversión |
| `robots.txt` | Configuración SEO |
| `sitemap.xml` | Páginas indexadas |

---

## ✅ Checklist Landing Page (Embudo)

- [x] Hero con CTA directo "Comprar ahora"
- [x] Productos con botones WhatsApp
- [x] Combos con CTA directo
- [x] Beneficios/Trust (envío, pago, natural)
- [x] Testimonios reales
- [x] FAQ (objeciones comunes)
- [x] CTA final con urgencia
- [x] Sección distribuidores
- [x] Todos los CTAs dirigen a WhatsApp
- [x] Tipografía Poppins (sans serie)
- [x] Fondo con contraste entre secciones
- [x] Animaciones de entrada

---

## 🔐 Notas Importantes

- **No usar frameworks JS** (restricción del cliente)
- **Sin pasarela de pago** en landing (solo datos para transferencia)
- **Cierre por WhatsApp** con bot n8n
- **Precios en COP** por defecto (selector USD disponible)

---

## 📞 Contacto

- **WhatsApp:** +57 310 329 6863
- **Email:** (documentar si aplica)
- **Cliente:** StayFit Colombia

---

*Generado automáticamente - Abril 2026*