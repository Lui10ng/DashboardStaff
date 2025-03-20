import Cookies from 'js-cookie';

export const COOKIE_NAME = 'cookie-preferences';
export const COOKIE_EXPIRY = 365; // days

export function setCookiePreference(preference: 'all' | 'necessary'): void {
  Cookies.set(COOKIE_NAME, preference, {
    expires: COOKIE_EXPIRY,
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:'
  });
}

export function getCookiePreference(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}

export function removeCookiePreference(): void {
  Cookies.remove(COOKIE_NAME);
}