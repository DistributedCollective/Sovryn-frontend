import React from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { useDispatch } from 'react-redux';
import { actions } from './slice';

interface Props {
  step?: number;
}

export function BackButton(props: Props) {
  const dispatch = useDispatch();
  return (
    <Button
      type="button"
      className="position-absolute"
      onClick={() => dispatch(actions.changeStep(props.step || 2))}
      text={
        <>
          <Icon icon="caret-left" iconSize={24} className="text-white" />
        </>
      }
      minimal
    />
  );
}

BackButton.defaultProps = {
  step: 2,
};
