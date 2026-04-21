/**
 * checkout-ui: DEPRECATED — no longer used.
 * 
 * The modal-based checkout flow was replaced by direct WhatsApp CTAs.
 * This stub is kept to avoid import errors in any branch that may still
 * reference this module. Safe to delete in a future cleanup sprint.
 * 
 * @deprecated Since v3.0.0 — Use src/modules/whatsapp.js instead.
 */
export const CheckoutUI = {
    init() {},
    open() {},
    updateQty() {},
    updateSummary() {},
    async handleSubmit(e) { if (e) e.preventDefault(); },
};
