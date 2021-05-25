import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
import { useCookie } from 'app/hooks/useCookie';
import { sovAnalyticsCookie } from 'utils/classifiers';

export function usePageViews() {
  const location = useLocation();
  const { get } = useCookie();

  useEffect(() => {
    if (
      process.env.REACT_APP_GOOGLE_ANALYTICS &&
      !(get(sovAnalyticsCookie.name) === sovAnalyticsCookie.value)
    ) {
      if (!window.hasOwnProperty('ga') || !window.hasOwnProperty('gtag')) {
        ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
      }
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
}
