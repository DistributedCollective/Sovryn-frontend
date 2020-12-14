import React, { useEffect, useState } from 'react';
import { Collapse, Table } from 'react-bootstrap';
import { EventData } from 'web3-eth-contract';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ArrowDown from '../../assets/img/arrow-down.svg';
import ArrowUp from '../../assets/img/arrow-up.svg';
import { useIsConnected } from '../../../../hooks/useAccount';
import { getLendingContractName } from '../../../../../utils/blockchain/contract-helpers';
import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { weiToFixed } from '../../../../../utils/blockchain/math-helpers';
import { prettyTx } from '../../../../../utils/helpers';

import '../../assets/index.scss';
import clsx from 'clsx';
import { ComponentSkeleton } from 'app/components/PageSkeleton';
import { selectLendBorrowSovryn } from '../../selectors';
import { translations } from 'locales/i18n';
import { DisplayDate } from '../../../../components/ActiveUserLoanContainer/components/DisplayDate';

type Props = {};

const LendingHistory: React.FC<Props> = props => {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [open, setOpen] = useState(false);

  const { asset } = useSelector(selectLendBorrowSovryn);

  const contract = getLendingContractName(asset);
  const { events: mint, loading: loadingMint } = useGetContractPastEvents(
    contract,
    'Mint',
  );
  const { events: burn, loading: loadingBurn } = useGetContractPastEvents(
    contract,
    'Burn',
  );

  const [events, setEvents] = useState<EventData[]>([]);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    const merged = [...mint, ...burn].sort(
      (a, b) => b.blockNumber - a.blockNumber,
    );
    setEvents(merged);
  }, [mint, burn]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let time;
    if (copied) {
      time = setTimeout(() => {
        setCopied('');
      }, 1500);
    }
    return () => clearTimeout(time);
  }, [copied]);

  const onCopied = (text: string) => {
    if (text.length) {
      setCopied(text);
    }
  };

  const loading = loadingBurn || loadingMint;

  return (
    <div className="lending-history-container">
      <div className="lending-history">
        <h3>{t(translations.lend.history.title)}</h3>
        <div aria-expanded={open}>
          {open ? (
            <img src={ArrowUp} onClick={handleClose} alt="arrow up" />
          ) : (
            <img src={ArrowDown} onClick={handleOpen} alt="arrow down" />
          )}
        </div>
      </div>
      <Collapse in={open}>
        <div>
          {(loading || !isConnected) && <ComponentSkeleton />}
          {isConnected && (
            <>
              {events.length > 0 && !loading && (
                <div id="example-collapse-text">
                  <Table responsive="sm">
                    <thead>
                      <tr className="cell">
                        <th>Lend amount</th>
                        <th>Date &amp; time</th>
                        <th>Price</th>
                        <th>Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event, index) => (
                        <tr
                          key={index}
                          className={clsx(
                            'cell',
                            event.event === 'Mint'
                              ? 'cell__green'
                              : 'cell__red',
                          )}
                        >
                          <td>
                            {weiToFixed(event.returnValues.assetAmount, 8)}{' '}
                            <span className="text-muted">{asset}</span>
                          </td>
                          <td>
                            <DisplayDate
                              timestamp={String(
                                new Date((event as any).eventDate).getTime() /
                                  1000,
                              )}
                            />
                          </td>
                          <td>${weiToFixed(event.returnValues.price, 5)}</td>
                          <CopyToClipboard
                            text={event.transactionHash}
                            onCopy={() => onCopied(event.transactionHash)}
                          >
                            <td>
                              <Tooltip content={<> {event.transactionHash}</>}>
                                {prettyTx(event.transactionHash)}
                              </Tooltip>
                            </td>
                          </CopyToClipboard>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {events.length === 0 && !loading && (
                <div className="empty-history">History is empty.</div>
              )}
            </>
          )}
        </div>
      </Collapse>
      {copied && (
        <div className="alert-position alert alert-success">
          Copied: {copied.slice(0, 14)}...
        </div>
      )}
    </div>
  );
};

export default LendingHistory;
