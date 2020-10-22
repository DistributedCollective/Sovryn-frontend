/**
 *
 * TokenSwapContainer
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectTokenSwapContainer } from './selectors';
import { tokenSwapContainerSaga } from './saga';
import { useSwapNetwork_conversionPath } from '../../hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_rateByPath } from '../../hooks/swap-network/useSwapNetwork_rateByPath';
import { translations } from '../../../locales/i18n';
import { handleNumberInput } from '../../../utils/helpers';
import { Button } from '@blueprintjs/core';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { FormSelect } from '../../components/FormSelect';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Asset } from '../../../types/asset';
import { useSwapNetwork_approveAndConvertByPath } from '../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { TokenWalletBalance } from '../../components/TokenWalletBalance/Loadable';

const s = translations.tokenSwapContainer;

interface Form {
  amount: string;
  sourceToken: string;
  targetToken: string;
}

interface Props {}

export function TokenSwapContainer(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: tokenSwapContainerSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tokenSwapContainer = useSelector(selectTokenSwapContainer);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const [state, setState] = useState<Form>({
    amount: '0.001',
    sourceToken: AssetsDictionary.get(Asset.BTC).getTokenContractAddress(),
    targetToken: AssetsDictionary.get(Asset.DOC).getTokenContractAddress(),
  });

  const [options, setOptions] = useState<any[]>([]);

  const weiAmount = useWeiAmount(state.amount);

  const { value: tokens } = useCacheCallWithValue(
    'converterRegistry',
    'getConvertibleTokens',
    [],
  );

  useEffect(() => {
    setOptions(
      tokens.map(item => {
        const asset = AssetsDictionary.getByTokenContractAddress(item);
        return {
          key: asset.asset,
          label: asset.name,
          address: asset.getTokenContractAddress(),
        };
      }),
    );
  }, [tokens]);

  const { value: path } = useSwapNetwork_conversionPath(
    state.sourceToken,
    state.targetToken,
  );

  const { value: rateByPath } = useSwapNetwork_rateByPath(path, weiAmount);

  const { send, ...tx } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    rateByPath,
  );

  const handleAmountChange = useCallback(amount => {
    setState(prevState => ({
      ...prevState,
      amount,
    }));
  }, []);

  const handleFormSubmit = useCallback(
    event => {
      if (event && event.preventDefault) event.preventDefault();
      send();
    },
    [send],
  );

  const value = (address: string) => {
    if (!address) return undefined;
    return options.find(
      item => item.address.toLowerCase() === address.toLowerCase(),
    )?.key;
  };

  const getTargetAsset = () => {
    return value(path[path.length - 1]) || null;
  };

  const getSourceAsset = () => {
    return value(path[0]) || null;
  };

  if (!options.length) {
    return null;
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>{t(s.title)}</div>
        <div className="mb-3">
          Source Token:
          <FormSelect
            onChange={item =>
              setState(prevState => ({
                ...prevState,
                sourceToken: item.address,
              }))
            }
            value={value(state.sourceToken)}
            items={options}
          />
        </div>
        <div className="mb-3">
          Target Token:
          <FormSelect
            onChange={item =>
              setState(prevState => ({
                ...prevState,
                targetToken: item.address,
              }))
            }
            value={value(state.targetToken)}
            items={options}
          />
        </div>
        <div className="mb-3">
          <label>You send:</label>
          <input
            value={state.amount}
            onChange={e => handleAmountChange(handleNumberInput(e))}
          />
        </div>
        {getTargetAsset() && (
          <div>
            You get: {weiTo4(rateByPath)} {getTargetAsset()}
          </div>
        )}
        <Button
          type="submit"
          text={t(s.buttons.submit)}
          disabled={tx.loading || state.amount <= '0' || rateByPath <= '0'}
          loading={tx.loading}
        />
        {getSourceAsset() && <TokenWalletBalance asset={getSourceAsset()} />}
        {tx.status !== 'none' && (
          <SendTxProgress {...tx} displayAbsolute={false} />
        )}
      </form>
    </>
  );
}
