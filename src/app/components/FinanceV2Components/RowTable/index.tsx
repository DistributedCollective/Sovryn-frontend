import React from 'react';

export const RowTable: React.FC = ({ children }) => (
  <div className="xl:tw-w-98 2xl:tw-w-134">
    <table className="w-100">{children}</table>
  </div>
);
