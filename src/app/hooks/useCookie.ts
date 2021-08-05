export const getCookie = (key: string | undefined | null): string | null => {
  if (document.cookie && key) {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${key}=`));
    const value = cookie?.split('=')[1];
    return value || null;
  } else return null;
};

export const setCookie = (
  key: string | undefined | null,
  value: string,
  path: string = '/',
  expiry: number | null = null,
): void => {
  if (key && typeof value !== 'undefined') {
    /*
     * max expiry date for a cookie - https://en.wikipedia.org/wiki/Year_2038_problem
     * some browsers (e.g. Brave) will ignore this and only set a max of 5 months expiry
     */
    let expiryDate = 'Tue, 19 Jan 2038 04:14:07 GMT';
    if (expiry) expiryDate = new Date(expiry).toUTCString();
    document.cookie = `${key}=${value}; expires=${expiryDate}; path=${path}`;
  }
};

export const clearCookie = (
  key: string | undefined | null,
  path: string = '/',
): void => {
  if (key)
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
};

export const checkCookie = (key: string | undefined | null): boolean => {
  return (
    (key &&
      document.cookie
        .split(';')
        .some(item => item.trim().startsWith(`${key}=`))) ||
    false
  );
};

export function useCookie() {
  return {
    get: getCookie,
    set: setCookie,
    clear: clearCookie,
    check: checkCookie,
  };
}
