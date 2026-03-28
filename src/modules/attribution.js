import { CONFIG } from './config.js';

/**
 * attribution module handles UTM and persistence.
 */
export const Attribution = {
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        
        CONFIG.UTM_PARAMS.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                localStorage.setItem(CONFIG.STORAGE_PREFIX + param, value);
            }
        });

        if (!localStorage.getItem(CONFIG.STORAGE_PREFIX + 'first_visit')) {
            localStorage.setItem(CONFIG.STORAGE_PREFIX + 'first_visit', new Date().toISOString());
        }
        console.log('StayFit [Attribution]: UTM tracking initialized');
    },

    getSuffix() {
        const source = localStorage.getItem(CONFIG.STORAGE_PREFIX + 'utm_source') || 'organico';
        const campaign = localStorage.getItem(CONFIG.STORAGE_PREFIX + 'utm_campaign') || 'directo';
        const medium = localStorage.getItem(CONFIG.STORAGE_PREFIX + 'utm_medium') || '';
        
        return `\n\n[Atribución: ${source}${medium ? '/' + medium : ''} - ${campaign}]`;
    }
};
