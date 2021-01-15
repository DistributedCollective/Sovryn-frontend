import React from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { useDispatch } from 'react-redux';
import { actions } from './slice';

interface Props {
  step?: number;
}

export default function BackButton(props: Props) {
  const dispatch = useDispatch();
  return (
    <Button
      type="button"
      className="position-absolute flat-icon"
      style={{
        left: '30px',
        top: '20px',
      }}
      onClick={() => dispatch(actions.changeStep(props.step || 2))}
      text={
        <>
          <Icon icon="chevron-left" iconSize={55} className="text-white" />
        </>
      }
      minimal
    />
  );
}

BackButton.defaultProps = {
  step: 2,
};
