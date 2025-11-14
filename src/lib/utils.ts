/**
 * Utility functions for common operations
 */

import type { ApiResponse } from './api';

type ImageItem = string | { src?: string; url?: string; alt?: string; type?: string };

export interface ContactInfoType {
    icon: string;
    alt: string;
    text: string;
    link?: string;
}

export interface ContactContent {
    whatsapp?: string;
    phone?: string;
    email?: string;
    facebook?: string;
}

/**
 * Extract image source URL from ImageItem (string or object)
 */
export function getImageSrc(item: ImageItem): string {
    return typeof item === 'string' ? item : item.src || item.url || '';
}

/**
 * Extract image alt text from ImageItem with fallback
 */
export function getImageAlt(item: ImageItem, fallback: string): string {
    return typeof item === 'string' ? fallback : (item.alt || fallback);
}

/**
 * Get content from API response (handles both 'data' and 'content' properties)
 */
export function getApiContent<T>(response: ApiResponse<T> | (ApiResponse<unknown> & { content?: T })): T | null {
    if (!response.success) return null;
    const data = (response as ApiResponse<T>).data ?? (response as { content?: T }).content;
    return (data as T) ?? null;
}

/**
 * Create contact info array from contact content
 */
export function createContactInfo(
    content: ContactContent | undefined,
    translations: {
        whatsapp: string;
        phone: string;
        email: string;
        facebook: string;
    }
): ContactInfoType[] {
    const defaults = {
        whatsapp: "+852 6806-0108",
        phone: "+852 3020-6719",
        email: "leego.scaffolding@gmail.com",
        facebook: "https://www.facebook.com/MasterHongScaffolding/",
    };

    return [
        {
            icon: "/whatsapp-icon.png",
            alt: translations.whatsapp,
            text: content?.whatsapp || defaults.whatsapp,
            link: content?.whatsapp || defaults.whatsapp,
        },
        {
            icon: "/print-icon.png",
            alt: translations.phone,
            text: content?.phone || defaults.phone,
            link: `tel:${(content?.phone || defaults.phone).replace(/\s/g, "")}`,
        },
        {
            icon: "/email-icon.png",
            alt: translations.email,
            text: content?.email || defaults.email,
            link: `mailto:${content?.email || defaults.email}`,
        },
        {
            icon: "/fb-icon.png",
            alt: translations.facebook,
            text: content?.facebook || defaults.facebook,
            link: content?.facebook || defaults.facebook,
        },
    ];
}

