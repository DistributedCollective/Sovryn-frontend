import React from 'react';
import { isMainnet } from '../../../utils/classifiers';
export function LocalSharedArrayBuffer() {
  if (process.env.NODE_ENV === 'development' && isMainnet) {
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
