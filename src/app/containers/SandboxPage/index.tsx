/**
 *
 * SandboxPage
 *
 */

import React from 'react';
import { TutorialDialogModal } from '../../containers/TutorialDialogModal/Loadable';

interface Props {}

export function SandboxPage(props: Props) {
  return (
    <div className="bg-blue">
      <TutorialDialogModal />
    </div>
  );
}
