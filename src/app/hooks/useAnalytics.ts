import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

import { useCookie } from 'app/hooks/useCookie';
import { sovAnalyticsCookie } from 'utils/classifiers';

const { get } = useCookie();

const analyticsAllowed = () =>
  process.env.REACT_APP_GOOGLE_ANALYTICS &&
  !(get(sovAnalyticsCookie.name) === sovAnalyticsCookie.value);

const initGA = () => {
  if (!window.hasOwnProperty('ga') || !window.hasOwnProperty('gtag')) {
    ReactGA.initialize(String(process.env.REACT_APP_GOOGLE_ANALYTICS));
  }
};

/**
 * All ReactGA methods are described in api docs:
 * https://github.com/react-ga/react-ga
 */

export function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    if (analyticsAllowed()) {
      initGA();
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
}

export function useEvent() {
  return (options: ReactGA.EventArgs) => {
    if (analyticsAllowed()) {
      initGA();
      ReactGA.event(options);
    }
  };
}

export function useTiming() {
  return (options: ReactGA.TimingArgs) => {
    if (analyticsAllowed()) {
      initGA();
      ReactGA.timing(options);
    }
  };
}
