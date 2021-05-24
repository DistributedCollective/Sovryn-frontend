import React from 'react';

export const RowTable: React.FC = ({ children }) => (
  <div className="xl:tw-w-155 2xl:tw-w-163">
    <table className="w-100">{children}</table>
  </div>
);
