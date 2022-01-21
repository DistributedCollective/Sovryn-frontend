import React from 'react';
import { toast } from 'react-toastify';
import { ReactComponent as IconSuccess } from 'assets/images/icon-success.svg';
import { ReactComponent as IconRejected } from 'assets/images/failed-tx.svg';

export function Toast(type: string, message: React.ReactNode) {
  const toastConfig = {
    position: toast.POSITION.TOP_CENTER,
    toastId: type,
    delay: 500,
    hideProgressBar: true,
    icon: false,
    autoClose: 5000,
  };

  switch (type) {
    case 'warning':
      return toast.warning(message);
    case 'error':
      return toast.error(
        <>
          <IconRejected /> {message}
        </>,
        toastConfig,
      );
    case 'success':
      return toast.success(
        <>
          <IconSuccess /> {message}
        </>,
        toastConfig,
      );
    case 'info':
      return toast.info(message);
    case 'dark':
      return toast.dark(message);
    default:
      return toast(message);
  }
}
