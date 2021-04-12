/**
 *
 * Dialog
 *
 */

import React, { Suspense } from 'react';
import { Dialog as BPDialog } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { ComponentSkeleton } from '../../components/PageSkeleton';
import CloseIcon from 'assets/images/new-tutorial/close.png';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isCloseButtonShown?: boolean;
  children: React.ReactNode;
  canEscapeKeyClose?: boolean;
  canOutsideClickClose?: boolean;
  className?: string;
}

export function Dialog(props: Props) {
  return (
    <BPDialog
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      canEscapeKeyClose={props.canEscapeKeyClose}
      canOutsideClickClose={props.canOutsideClickClose}
      className={props.className}
    >
      {props.isCloseButtonShown && (
        <div className="tw-mb-4 tw-text-right tw-absolute tw--right-5 tw--top-5">
          <StyledClose onClick={() => props.onClose()}>
            <img src={CloseIcon} alt="close" />
          </StyledClose>
        </div>
      )}
      <Suspense fallback={<ComponentSkeleton lines={4} />}>
        {props.children}
      </Suspense>
    </BPDialog>
  );
}

Dialog.defaultProps = {
  isCloseButtonShown: true,
  onClose: () => {},
};

const StyledClose = styled.button.attrs(_ => ({ type: 'button' }))`
  width: 24px;
  height: 24px;
  border: 1px solid var(--white);
  color: var(--white);
  background-color: var(--primary);
  border-radius: 12px;
  padding: 0;
  margin: 0;
`;
