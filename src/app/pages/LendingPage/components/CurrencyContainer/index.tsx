import React, { useEffect, useState } from 'react';

import CurrencyRow from './CurrencyRow';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useLocation, useHistory } from 'react-router-dom';
import { IPromotionLinkState } from 'app/components/Promotions/components/PromotionCard/types';
import { useIsConnected } from 'app/hooks/useAccount';

const currencyRows = LendingPoolDictionary.list();

const CurrencyContainer: React.FC = () => {
  const lendAmount = '0';
  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();
  const weiLendAmount = useWeiAmount(lendAmount);
  const [linkAsset] = useState(location.state?.asset);

  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.DEPOSIT_LEND]: depositLendLocked,
    [States.WITHDRAW_LEND]: withdrawLendLocked,
  } = checkMaintenances();
  const connected = useIsConnected();

  useEffect(() => linkAsset && history.replace(location.pathname), [
    history,
    linkAsset,
    location.pathname,
    location.state,
  ]);

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-p-0 tw-mx-auto">
      {currencyRows.map(info => {
        return (
          <CurrencyRow
            key={info.getAsset()}
            lendingPool={info}
            lendingAmount={info.getAsset() ? weiLendAmount : '0'}
            depositLocked={depositLendLocked}
            withdrawLocked={withdrawLendLocked}
            linkAsset={depositLendLocked || !connected ? undefined : linkAsset}
          />
        );
      })}
    </div>
  );
};

export default CurrencyContainer;
