import React from 'react';

export const RowTable: React.FC = ({ children }) => (
  <div className="xl:tw-w-96 2xl:tw-w-139">
    <table className="w-100">{children}</table>
  </div>
);
