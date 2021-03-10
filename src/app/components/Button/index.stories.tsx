import React from 'react';
import { Button } from './index';

export const Primary = () => <Button text="Button" onClick={() => {}} />;
export const Secondary = () => (
  <Button text="Button" loading disabled onClick={() => {}} />
);

export default {
  title: 'Form Elements',
};
