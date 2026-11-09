import { Capacitor } from '@capacitor/core';

// Production deployed Cloud Run service URL
export const DEPLOYED_BACKEND_URL =
  'https://ais-pre-rrohwa5nu7heztp5fhk37t-726579604123.europe-west1.run.app';

/**
 * Resolves the appropriate API endpoint URL depending on the platform.
 * - On web / dev server, relative '/api/...' routes to current origin.
 * - On Android / iOS native Capacitor runtime, routes to the deployed backend URL.
 */
export function getApiUrl(endpointPath: string): string {
  const normalizedPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;

  // Custom environment override if defined
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return `${envUrl.replace(/\/$/, '')}${normalizedPath}`;
  }

  // Native Android/iOS runtime check
  if (Capacitor.isNativePlatform()) {
    return `${DEPLOYED_BACKEND_URL}${normalizedPath}`;
  }

  // WebView check where window origin is capacitor:// or localhost without backend
  if (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
      window.location.hostname === 'localhost' && !window.location.port)
  ) {
    return `${DEPLOYED_BACKEND_URL}${normalizedPath}`;
  }

  // Standard web browser relative path
  return normalizedPath;
}
