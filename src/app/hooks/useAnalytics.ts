import { useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import ReactGA from 'react-ga';

// import { getCookie } from 'app/hooks/useCookie';
// import { sovAnalyticsCookie } from 'utils/classifiers';

// const analyticsAllowed = () =>
//   process.env.REACT_APP_GOOGLE_ANALYTICS &&
//   !(getCookie(sovAnalyticsCookie.name) === sovAnalyticsCookie.value);

// const initGA = () => {
//   if (!window.hasOwnProperty('ga') || !window.hasOwnProperty('gtag')) {
//     ReactGA.initialize(String(process.env.REACT_APP_GOOGLE_ANALYTICS));
//   }
// };

/**
 * All ReactGA methods are described in api docs:
 * https://github.com/react-ga/react-ga
 */

export function usePageViews() {
  // const location = useLocation();
  // useEffect(() => {
  //   if (analyticsAllowed()) {
  //     initGA();
  //     ReactGA.set({ page: location.pathname });
  //     ReactGA.pageview(location.pathname);
  //   }
  // }, [location]);
}

export function useEvent() {
  return useCallback(options => {
    // if (analyticsAllowed()) {
    //   initGA();
    //   ReactGA.event(options);
    // }
  }, []);
}

export function useTiming() {
  return useCallback(options => {
    // if (analyticsAllowed()) {
    //   initGA();
    //   ReactGA.timing(options);
    // }
  }, []);
}
