import { Position, Toaster } from '@blueprintjs/core';
import React from 'react';

export const bottomRightToaster = Toaster.create({
  position: Position.BOTTOM_RIGHT,
});

export const toaster = Toaster.create({
  position: Position.TOP,
});

export function toastSuccess(message: React.ReactNode, key?: string) {
  return toaster.show(
    {
      message,
      intent: 'success',
    },
    key,
  );
}

export function toastError(message: React.ReactNode, key?: string) {
  return toaster.show(
    {
      message,
      intent: 'danger',
    },
    key,
  );
}
