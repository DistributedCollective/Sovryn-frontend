/**
 *
 * SandboxPage
 *
 */

import React, { useCallback } from 'react';
import { startLedger } from '../../../utils/hw/ledger-provider';
import { Button } from '@blueprintjs/core';

interface Props {}

export function SandboxPage(props: Props) {
  const handleHardwareConnect = useCallback(async () => {
    await startLedger();
  }, []);

  return (
    <div className="bg-blue">
      <Button text="Start" onClick={handleHardwareConnect} />
    </div>
  );
}
