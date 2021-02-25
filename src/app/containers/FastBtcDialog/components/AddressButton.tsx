import React from 'react';
import { Button } from '@blueprintjs/core';

interface Props {
  loading: boolean;
  ready: boolean;
  onClick: () => void;
}

export function AddressButton({ loading, ready, onClick }: Props) {
  return (
    <>
      <div className="justify-content-center items-center d-flex flex-row">
        <Button
          minimal
          className="text-gold button-round font-size-lg mx-auto"
          text="Generate deposit address"
          loading={loading}
          disabled={loading || !ready}
          onClick={onClick}
        />
      </div>
    </>
  );
}
