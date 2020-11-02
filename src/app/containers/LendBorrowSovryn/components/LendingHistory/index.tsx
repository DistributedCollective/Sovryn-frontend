import React, { useEffect, useState } from 'react';
import { Collapse, Table } from 'react-bootstrap';
import { EventData } from 'web3-eth-contract';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@blueprintjs/core';
import ArrowDown from '../../assets/img/arrow-down.svg';
import ArrowUp from '../../assets/img/arrow-up.svg';
import { useAccount } from '../../../../hooks/useAccount';
import { getLendingContractName } from '../../../../../utils/blockchain/contract-helpers';
import { useGetContractPastEvents } from '../../../../hooks/useGetContractPastEvents';
import { Asset } from '../../../../../types/asset';
import { weiToFixed } from '../../../../../utils/blockchain/math-helpers';
import { prettyTx } from '../../../../../utils/helpers';

import '../../assets/index.scss';
import clsx from 'clsx';

type Props = {};

const LendingHistory: React.FC<Props> = props => {
  const [open, setOpen] = useState(false);

  const account = useAccount();
  const contract = getLendingContractName(Asset.BTC);
  const {
    events: mint,
    fetch: fetchMint,
    // loading: loadingMint,
  } = useGetContractPastEvents(contract, 'Mint');
  const {
    events: burn,
    fetch: fetchBurn,
    // loading: loadingBurn,
  } = useGetContractPastEvents(contract, 'Burn');

  const [events, setEvents] = useState<EventData[]>([]);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    if (account) {
      fetchMint({ minter: account });
      fetchBurn({ burner: account });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

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

  return (
    <div className="lending-history-container">
      <div className="lending-history">
        <h3>lending history </h3>
        <div aria-expanded={open}>
          {open ? (
            <img src={ArrowUp} onClick={handleClose} alt="arrow up" />
          ) : (
            <img src={ArrowDown} onClick={handleOpen} alt="arrow down" />
          )}
        </div>
      </div>
      <Collapse in={open}>
        {!events.length ? (
          <div className="empty-history">History is empty.</div>
        ) : (
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
                    className={clsx(
                      'cell',
                      event.event === 'Mint' ? 'cell__green' : 'cell__red',
                    )}
                  >
                    <td>{weiToFixed(event.returnValues.assetAmount, 8)}</td>
                    <td>&mdash;</td>
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
