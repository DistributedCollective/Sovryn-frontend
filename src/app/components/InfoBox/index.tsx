import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@blueprintjs/core';
import * as storage from 'utils/storage';

interface Props {
  icon: string;
  content: React.ReactNode;
  localStorageRef: string;
}

export function InfoBox(props: Props) {
  const [show, setShow] = useState<any>(true);

  useEffect(() => {
    setShow(storage.session.getItem(props.localStorageRef) !== 'false');
  }, [show, props.localStorageRef]);

  function closeInfoBox() {
    setShow(false);
    storage.session.setItem(props.localStorageRef, 'false');
  }

  return (
    <div className={`tw-my-4 tw-hidden ${show && 'tw-block'}`}>
      <div className="tw-p-4 sovryn-border">
        <Button
          icon="cross"
          onClick={() => closeInfoBox()}
          minimal
          className="tw-float-right"
        />
        <p className="tw-py-4">
          <Icon icon="info-sign" className="tw-mr-6" />
          {props.content}
        </p>
      </div>
    </div>
  );
}
