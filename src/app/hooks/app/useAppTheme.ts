import { useEffect, useState } from 'react';

function getFaviconEl(): HTMLLinkElement {
  return document.getElementById('favicon') as HTMLLinkElement;
}

function resolveColorScheme() {
  try {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch (e) {
    return 'light';
  }
}

export function useAppTheme() {
  const [theme, setTheme] = useState(resolveColorScheme());
  useEffect(() => {
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
          setTheme(e.matches ? 'dark' : 'light');
        });
    } catch (e) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    // add white favicon for dark mode.
    const fav = getFaviconEl();
    fav.href = theme === 'dark' ? '/favicon-white.png' : '/favicon.png';
    fav.type = 'image/png';
    fav.sizes.add('48x48');
  }, [theme]);
}
