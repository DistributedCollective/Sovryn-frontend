import React from 'react';

export function CloseModalButton() {
  return (
    <div
      className="position-absolute"
      style={{ top: '0', right: '0', fontSize: '12px', cursor: 'pointer' }}
    >
      <u>Close</u> X
    </div>
  );
}
