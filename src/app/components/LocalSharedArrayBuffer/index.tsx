import React from 'react';
import { currentNetwork } from '../../../utils/classifiers';
export function LocalSharedArrayBuffer() {
  if (process.env.NODE_ENV === 'development' && currentNetwork === 'mainnet') {
    // See https://github.com/facebook/react/issues/20829#issuecomment-802088260
    return (
      <script>
        if (!crossOriginIsolated) SharedArrayBuffer = ArrayBuffer;
      </script>
    );
  }

  return null;
}
LocalSharedArrayBuffer();
