import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mixPanel, { Callback, Dict, RequestOptions } from 'mixpanel-browser';
import crypto from 'crypto';

import { getCookie } from 'app/hooks/useCookie';
import { sovAnalyticsCookie } from 'utils/classifiers';

const analyticsAllowed = () =>
  process.env.REACT_APP_MIXPANEL_ID &&
  !(getCookie(sovAnalyticsCookie.name) === sovAnalyticsCookie.value);

if (analyticsAllowed()) {
  mixPanel.init(String(process.env.REACT_APP_MIXPANEL_ID), {
    debug: !!process.env.REACT_APP_MIXPANEL_DEBUG,
  });
}

export function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    if (analyticsAllowed()) {
      mixPanel.track('Page View');
    }
  }, [location]);
}

export function useEvent() {
  return useCallback(
    (
      event_name: string,
      properties?: Dict,
      optionsOrCallback?: RequestOptions | Callback,
      callback?: Callback,
    ) => {
      if (analyticsAllowed()) {
        mixPanel.track(event_name, properties, optionsOrCallback, callback);
      }
    },
    [],
  );
}

export const setIdentity = (uid: string) => {
  if (analyticsAllowed()) {
    mixPanel.identify(crypto.createHash('md5').update(uid).digest('hex'));
  }
};
