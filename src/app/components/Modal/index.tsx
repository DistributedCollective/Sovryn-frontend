import React from 'react';
import { Dialog } from '@blueprintjs/core';

interface Props {
  show: boolean;
  content?: any;
}

export function Modal(props: Props) {
  return (
    <Dialog
      isOpen={props.show}
      className="tw-bg-black tw-border-0 tw-max-w-29 tw-w-full tw-px-6 tw-py-6 md:tw-px-9 md:tw-py-7 sm:tw-p-4 tw-rounded-3xl tw-relative"
    >
      {props.content}
    </Dialog>
  );
}
