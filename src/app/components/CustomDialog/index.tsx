/**
 *
 * CustomDialog
 *
 */

import React from 'react';
import { Button, Dialog } from '@blueprintjs/core';

interface Props {
  show: boolean;
  onClose: () => void;
  title: React.ReactNode;
  content: React.ReactNode;
}

export function CustomDialog(props: Props) {
  return (
    <Dialog isOpen={props.show} className="bg-secondary tw-p-4">
      <div className="tw-container tw-mx-auto tw-px-4">
        <div className="tw-flex tw-justify-between tw-mb-4">
          <h4>{props.title}</h4>
          <Button icon="cross" onClick={props.onClose} minimal />
        </div>
        {props.content}
      </div>
    </Dialog>
  );
}
