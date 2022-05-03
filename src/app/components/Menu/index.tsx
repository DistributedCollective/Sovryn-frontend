import React, { ReactNode } from 'react';

type MenuProps = {
  className?: string;
  children?: ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ className, children }) => (
  <ul className={className}>{children}</ul>
);
