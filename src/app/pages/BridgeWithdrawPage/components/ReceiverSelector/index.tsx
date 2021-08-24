import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { FormGroup } from '../../../../components/Form/FormGroup';
import networkList from '../../../../components/NetworkRibbon/component/network.json';
import { BridgeNetworkDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Input } from '../../../../components/Form/Input';
import { ActionButton } from 'app/components/Form/ActionButton';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { rskWalletAddressLength } from 'app/constants';

export function ReceiverSelector() {
  const { t } = useTranslation();
  const trans = translations.BridgeWithdrawPage.receiverSelector;
  const { targetChain, targetAsset, receiver } = useSelector(
    selectBridgeWithdrawPage,
  );
  const dispatch = useDispatch();

  const network = useMemo(
    () => BridgeNetworkDictionary.get(targetChain as Chain),
    [targetChain],
  );

  const currentNetwork =
    networkList.find(item => item.chainId === network?.chainId)?.name ||
    network?.name;

  const [value, setValue] = useState(receiver);

  const selectReceiver = useCallback(() => {
    dispatch(actions.selectReceiver(value.toLowerCase()));
  }, [dispatch, value]);

  const valid = useMemo(() => {
    return value && value.length === rskWalletAddressLength;
  }, [value]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
        <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
          {t(trans.title, { currentNetwork })}
        </div>
        <div className="tw-w-80">
          <FormGroup label={`Receiving ${targetAsset} Address`}>
            <Input value={value} onChange={val => setValue(val)} />
          </FormGroup>
        </div>
        <div className="text-center tw-mt-10 tw-mb-2">{t(trans.confirm)}</div>

        <ActionButton
          className="tw-mt-10 tw-w-80 tw-font-semibold tw-rounded-xl"
          text={t(translations.common.next)}
          disabled={!valid}
          onClick={selectReceiver}
        />
      </div>
    </div>
  );
}
