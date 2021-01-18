import React from 'react';

interface Props {
  condition?: boolean;
  wrapper: (children: React.ReactNode) => any;
  children: React.ReactNode;
}

export const ConditionalWrapper = ({ condition, wrapper, children }: Props) =>
  condition ? wrapper(children) : children;
