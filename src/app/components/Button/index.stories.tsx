import React from 'react';
import { Button } from './index';

export const Primary = () => <Button text="Button" onClick={() => {}} />;
export const Secondary = () => (
  <Button text="Button" loading disabled onClick={() => {}} />
);

export const TailwindTest = () => (
  <div className="tw-h-16 tw-w-1/2 tw-bg-green tw-text-black tw-skeleton">
    TAILWIND DOES <span className="tw-opacity-0">NOT</span> WORK
  </div>
);

export default {
  title: 'Form Elements',
};
