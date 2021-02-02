import React from 'react';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { useDispatch } from 'react-redux';
import { actions } from './slice';
import iconBack from 'assets/images/genesis/arrow_back.svg';

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
          <img src={iconBack} alt="back" />
        </>
      }
      minimal
    />
  );
}

BackButton.defaultProps = {
  step: 2,
};
