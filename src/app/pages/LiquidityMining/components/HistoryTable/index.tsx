import React from 'react';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';

export const HistoryTable: React.FC = () => {
  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <TableHeader />
          <TableBody />
        </table>
        {/* {history.length > 0 && (
          <Pagination
            totalRecords={history.length}
            pageLimit={6}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )} */}
      </div>
    </section>
  );
};
