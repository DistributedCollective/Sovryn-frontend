import React from 'react';
import { toast, ToastOptions, TypeOptions } from 'react-toastify';
import iconSuccess from 'assets/images/icon-success.svg';
import iconError from 'assets/images/icon-rejected.svg';

const getIcon = (toastType?: TypeOptions) => {
  switch (toastType) {
    case 'success':
    case 'info':
    case 'default':
      return iconSuccess;

    case 'error':
    case 'warning':
      return iconError;

    default:
      return iconSuccess;
  }
};

interface ICustomToastContentProps {
  toastProps: ToastOptions;
  mainInfo: string;
  additionalInfo: React.ReactNode | string;
}

export const CustomToastContent: React.FC<ICustomToastContentProps> = ({
  toastProps,
  mainInfo,
  additionalInfo,
}) => (
  <div className="tw-flex tw-items-start">
    <img
      src={getIcon(toastProps?.type)}
      alt="success"
      className="tw-w-7 tw-mr-2.5"
    />

    <div className="tw-flex tw-text-black tw-items-start">
      <span className="tw-font-semibold tw-font-loose tw-mt-0.5">
        {mainInfo}
      </span>
      <span className="tw-text-xs tw-font-normal tw-font-medium tw-mt-1.5 tw-ml-4">
        {additionalInfo}
      </span>
    </div>
  </div>
);

export const toastOptions: ToastOptions = {
  hideProgressBar: false,
  position: toast.POSITION.TOP_CENTER,
  pauseOnHover: false,
  icon: false,
  closeButton: false,
  className: 'tw-rounded-lg',
};
