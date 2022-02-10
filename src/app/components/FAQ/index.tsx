import { Dialog } from '@blueprintjs/core';
import React, { useState } from 'react';
import { FAQDialogContent } from './components/FAQDialogContent';
import './style.scss';

export const FAQ: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Dialog
        className="tw-w-full tw-max-w-4xl tw-p-16"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FAQDialogContent />
      </Dialog>
      <div
        onClick={() => setIsOpen(true)}
        className="tw-fixed tw-bottom-0 tw-right-32 tw-h-8 tw-bg-black tw-px-4 tw-flex tw-items-center tw-rounded-t tw-shadow tw-cursor-pointer hover:tw-text-primary tw-transition-colors"
      >
        FAQ
      </div>
    </>
  );
};
