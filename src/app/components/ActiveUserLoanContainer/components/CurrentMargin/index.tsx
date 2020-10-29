import React from 'react';
import { weiTo4 } from 'utils/blockchain/math-helpers';
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
      <div className="d-md-inline d-sm-block">{`${weiTo4(
        props.currentMargin,
      )} %`}</div>
      <small
        className="d-md-inline d-sm-block ml-2 mr-2"
        style={{
          color: diff > 0 ? 'var(--Green)' : 'var(--Red)',
        }}
      >
        <div className="d-inline">
          <FontAwesomeIcon
            icon={diff > 0 ? faLongArrowAltUp : faLongArrowAltDown}
          />
          {` ${diff.toFixed(4)} %`}
        </div>
      </small>
    </>
  );
}
