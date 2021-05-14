import React from 'react';

interface ITopInfoTitleProps {
  title: string;
}

export const TopInfoTitle: React.FC<ITopInfoTitleProps> = ({
  title,
}: ITopInfoTitleProps) => (
  <div className="tw-text-xs tw-tracking-normal">{title}</div>
);
