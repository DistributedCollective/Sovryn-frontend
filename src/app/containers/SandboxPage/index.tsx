/**
 *
 * SandboxPage
 *
 */

import React from 'react';
import { TutorialDialog } from '../../components/TutorialDialog/container';

interface Props {}

export function SandboxPage(props: Props) {
  return (
    <div className="bg-blue">
      <TutorialDialog />
    </div>
  );
}
