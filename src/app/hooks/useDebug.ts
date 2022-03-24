import { debug } from '@sovryn/common';
import { useEffect, useRef } from 'react';

export const useDebug = (namespace: string) => {
  const logger = useRef(debug(namespace));
  return logger.current;
};

export const useLog = (namespace: string, ...args: any[]) => {
  const { log } = useDebug(namespace);
  useEffect(() => {
    log(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log, JSON.stringify(args)]);
};

export const useLogError = (namespace: string, ...args: any[]) => {
  const { error } = useDebug(namespace);
  useEffect(() => {
    error(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, JSON.stringify(args)]);
};
