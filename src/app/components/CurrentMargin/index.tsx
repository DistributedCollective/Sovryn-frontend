import React from 'react';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  currentMargin: string;
  startMargin: string;
}

export function CurrentMargin(props: Props) {
  const diff =
    Number(weiTo4(props.currentMargin)) - Number(weiTo4(props.startMargin));

  return (
    <>
      <div className="d-inline">{`${weiTo4(props.currentMargin)} %`}</div>
      <div
        className="d-inline float-right"
        style={{ fontSize: '13px', color: diff > 0 ? 'Green' : 'Red' }}
      >
        <FontAwesomeIcon
          icon={diff > 0 ? faLongArrowAltUp : faLongArrowAltDown}
        />
        {` ${diff.toFixed(4)} %`}
      </div>
    </>
  );
}
