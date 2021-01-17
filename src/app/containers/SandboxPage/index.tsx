/**
 *
 * SandboxPage
 *
 */

import React from 'react';
import { EngageWalletDialog } from '../EngageWalletDialog/Loadable';

interface Props {}

export function SandboxPage(props: Props) {
  return (
    <div className="bg-blue">
      <EngageWalletDialog />
    </div>
  );
}
