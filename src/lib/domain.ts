/**
 * Domain detection and URL generation utilities
 * Supports multiple domains for the same application
 */

export const SUPPORTED_DOMAINS = [
  'leegoscaffolding.com',
  'www.leegoscaffolding.com',
  'callhong.com',
  'www.callhong.com',
] as const;

const DEFAULT_DOMAIN = 'leegoscaffolding.com';

/**
 * Get the current domain from request headers
 * Falls back to default domain if headers are unavailable or domain is unsupported
 */
export function getCurrentDomain(): string {
  try {
    // Import headers dynamically to avoid build-time issues
    const { headers } = require('next/headers');
    const host = headers().get('host');

    if (!host) {
      return DEFAULT_DOMAIN;
    }

    // Strip port number if present (for localhost development)
    const domainWithoutPort = host.split(':')[0];

    // Check if it's localhost and return it as-is for development
    if (isLocalhost(domainWithoutPort)) {
      return host; // Return with port for localhost
    }

    // Check if the domain is in our supported list
    if (SUPPORTED_DOMAINS.includes(domainWithoutPort as any)) {
      return domainWithoutPort;
    }

    // Return default domain for unsupported domains
    return DEFAULT_DOMAIN;
  } catch (error) {
    // headers() is not available during build time
    // Fall back to default domain
    return DEFAULT_DOMAIN;
  }
}

/**
 * Get the base URL (protocol + domain)
 * Uses HTTPS in production, HTTP for localhost development
 */
export function getBaseUrl(): string {
  const domain = getCurrentDomain();

  // Handle localhost for development
  if (isLocalhost(domain.split(':')[0])) {
    return `http://${domain}`;
  }

  // Production domains always use HTTPS
  return `https://${domain}`;
}

/**
 * Get full URL for a given path
 */
export function getUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

/**
 * Get canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ''): string {
  return getUrl(path);
}

/**
 * Get image URL with current domain
 */
export function getImageUrl(imagePath: string): string {
  return getUrl(imagePath);
}

/**
 * Check if current domain is callhong.com
 */
export function isCallHongDomain(): boolean {
  const domain = getCurrentDomain();
  return domain === 'callhong.com' || domain === 'www.callhong.com';
}

/**
 * Check if current domain is leegoscaffolding.com
 */
export function isLeegoScaffoldingDomain(): boolean {
  const domain = getCurrentDomain();
  return domain === 'leegoscaffolding.com' || domain === 'www.leegoscaffolding.com';
}

/**
 * Check if domain is localhost
 */
function isLocalhost(domain: string): boolean {
  return domain === 'localhost' || domain === '127.0.0.1';
}
