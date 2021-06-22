/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Chain } from 'types';

import { actions } from '../../slice';
import { selectBridgeWithdrawPage } from '../../selectors';
import { Button } from 'app/components/Button';
import { FormGroup } from '../../../../components/Form/FormGroup';
import networkList from '../../../../components/NetworkRibbon/component/network.json';
import { BridgeNetworkDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Input } from '../../../../components/Form/Input';

interface Props {}

export function ReceiverSelector(props: Props) {
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
    network?.name ||
    'Test';

  const [value, setValue] = useState(receiver);

  const selectReceiver = useCallback(() => {
    dispatch(actions.selectReceiver(value.toLowerCase()));
  }, [dispatch, value]);

  const valid = useMemo(() => {
    return value && value.length === 42;
  }, [value]);

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
      <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
        <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
          Enter receiving {currentNetwork} wallet address
        </div>
        <div className="tw-mw-320">
          <FormGroup label={`Receiving ${targetAsset} Address`}>
            <Input value={value} onChange={val => setValue(val)} />
          </FormGroup>
        </div>
        <div className="text-center tw-mt-4 tw-mb-2">
          Please check and confirm
        </div>
        <div className="text-center tw-mt-4 tw-mb-2">
          Your {targetAsset} will be send there!
        </div>

        <Button
          className="tw-mt-10 tw-w-full"
          text="Next"
          disabled={!valid}
          onClick={selectReceiver}
        />
      </div>
    </div>
  );
}
