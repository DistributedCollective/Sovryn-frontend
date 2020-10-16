import React from 'react';
import { Button } from 'react-bootstrap';
import '../../../assets/index.scss';

type Props = {
  rightButton: string;
  leftButton: string;
};

const ButtonGroup: React.FC<Props> = ({ leftButton, rightButton }) => {
  return (
    <div className="deposit-button-group">
      <Button variant="light" size="lg" className="button-deposit">
        {leftButton}
      </Button>
      <Button variant="light" size="lg" className="button-deposit">
        {rightButton}
      </Button>
    </div>
  );
};

export default ButtonGroup;
