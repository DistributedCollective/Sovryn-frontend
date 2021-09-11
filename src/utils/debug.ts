import { debug as sovrynDebug } from '@sovryn/common';

export const debug = (namespace: string) =>
  sovrynDebug(`@sovryn/dapp:${namespace}`);
