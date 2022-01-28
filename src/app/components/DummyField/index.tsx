import React from 'react';

interface IDummyFieldProps {
  children: React.ReactNode;
}

export const DummyField: React.FC<IDummyFieldProps> = ({ children }) => (
  <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-rounded-lg tw-border tw-border-solid tw-border-gray-3 tw-text-white tw-text-base tw-font-semibold tw-tracking-normal tw-h-10 tw-py-2.5 tw-px-3.5">
    {children}
  </div>
);
