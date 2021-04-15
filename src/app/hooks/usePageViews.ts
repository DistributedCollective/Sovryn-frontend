import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

export function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      if (!window.hasOwnProperty('ga') || !window.hasOwnProperty('gtag')) {
        ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
      }
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    }
  }, [location]);
}
