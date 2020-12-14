import React from 'react';
import { ActiveLoanExpandedRow } from '../ActiveLoanExpandedRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@blueprintjs/core';
import {
  formatAsBTC,
  numberToUSD,
  numberToPercent,
} from 'utils/display-text/format';
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  data: any;
  setExpandedId: any;
  setExpandedItem: any;
  expandedId: any;
  expandedItem: any;
}

const useSortableData = (
  items,
  config = { key: 'none', direction: 'none' },
) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export function ActiveLoanTableDesktop(props: Props) {
  const { items, requestSort, sortConfig } = useSortableData(props.data);
  function getIcons(name) {
    if (sortConfig.key !== name) {
      return <Icon icon="double-caret-vertical" iconSize={15} />;
    } else if (sortConfig.direction === 'ascending') {
      return <Icon icon="sort-asc" iconSize={15} className="text-white" />;
    } else {
      return <Icon icon="sort-desc" iconSize={15} className="text-white" />;
    }
  }

  return (
    <div className="bg-primary sovryn-border p-3 d-none d-md-block">
      <table className="sovryn-table">
        <thead>
          <tr style={{ cursor: 'pointer' }}>
            <th onClick={() => requestSort('icon')}>{getIcons('icon')}</th>
            <th onClick={() => requestSort('positionInUSD')}>
              Position Size {getIcons('positionInUSD')}
            </th>
            <th onClick={() => requestSort('currentMargin')}>
              Current Margin {getIcons('currentMargin')}
            </th>
            <th onClick={() => requestSort('interestAPR')}>
              Interest APR {getIcons('interestAPR')}
            </th>
            <th onClick={() => requestSort('startMargin')}>
              Start Price {getIcons('startMargin')}
            </th>
            <th onClick={() => requestSort('profit')}>
              Profit / Loss {getIcons('profit')}
            </th>
            <th style={{ cursor: 'initial' }} />
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const expanded = props.expandedId === item.id;
            return (
              <React.Fragment key={item.id}>
                <tr
                  onClick={() => {
                    if (!expanded) {
                      props.setExpandedItem(item);
                      props.setExpandedId(item.id);
                    } else {
                      props.setExpandedId('');
                    }
                  }}
                  className={`cursor-pointer ${
                    props.expandedId && !expanded && 'opaque'
                  }`}
                >
                  <td>
                    {item.icon === 'LONG' && (
                      <Icon
                        icon="circle-arrow-up"
                        className="text-customTeal mx-2"
                        iconSize={20}
                      />
                    )}
                    {item.icon === 'SHORT' && (
                      <Icon
                        icon="circle-arrow-down"
                        className="text-Gold mx-2"
                        iconSize={20}
                      />
                    )}{' '}
                    {item.pair}
                  </td>
                  <td>{formatAsBTC(item.positionSize, item.currency)}</td>
                  <td>
                    {numberToPercent(item.currentMargin, 2)}
                    <small
                      className={`d-md-inline d-sm-block ml-2 mr-2 ${
                        item.marginDiff > 0 ? 'text-green' : 'text-red'
                      }`}
                    >
                      <div className="d-inline">
                        <FontAwesomeIcon
                          icon={
                            item.marginDiff > 0
                              ? faLongArrowAltUp
                              : faLongArrowAltDown
                          }
                        />
                        {numberToPercent(item.marginDiff, 2)}
                      </div>
                    </small>
                  </td>
                  <td>{item.interestAPR} %</td>
                  <td>{numberToUSD(item.startPrice, 2)}</td>
                  <td
                    className={`${item.profit > 0 ? 'text-green' : 'text-red'}`}
                  >
                    {numberToUSD(item.profit, 4)}
                  </td>
                  <td>{item.actions}</td>
                </tr>
                {props.expandedId === item.id && (
                  <ActiveLoanExpandedRow
                    className="d-none d-md-block"
                    data={item}
                    key={props.expandedId}
                    handleClick={() => props.setExpandedId('')}
                  />
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
