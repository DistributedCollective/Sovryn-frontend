import React from 'react';
import { useIsWhitelisted } from '../../hooks/whitelist/useIsWhitelisted';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

export function WhitelistedNotification() {
  const isWhitelisted = useIsWhitelisted();

  if (isWhitelisted) return <></>;

  return (
    <div className="container mt-6 mb-4">
      <div className="bg-info sovryn-border rounded p-3 d-flex flex-row justify-content-start align-items-center">
        <div className="ml-3 mr-4">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>
          Currently Sovryn is available for invited users only and your wallet
          is not yet whitelisted. All interactions is disabled until you switch
          to whitelisted wallet or get whitelisted for current one.
        </div>
      </div>
    </div>
  );
}
