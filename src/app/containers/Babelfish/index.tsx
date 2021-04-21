import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { Select } from 'form/Select';
import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Dialog } from '../Dialog';
import { Text } from '@blueprintjs/core';
import { SwapAssetSelector } from '../SwapFormContainer/components/SwapAssetSelector';

interface Option {
  key: string;
  label: string;
}
interface AssetOption {
  key: Asset;
  label: string;
}

export function Babelfish() {
  const [show, setShow] = useState(true);
  const [chain, setChain] = useState('Ethereum');
  const [sourceToken, setSourceToken] = useState(Asset.DOC);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);

  const { value: tokens } = useCacheCallWithValue<string[]>(
    'converterRegistry',
    'getConvertibleTokens',
    [],
  );

  const getOptions = useCallback(() => {
    return (tokens
      .map(item => {
        const asset = AssetsDictionary.getByTokenContractAddress(item);
        if (!asset) {
          return null;
        }
        return {
          key: asset.asset,
          label: asset.symbol,
        };
      })
      .filter(item => item !== null) as unknown) as AssetOption[];
  }, [tokens]);

  useEffect(() => {
    const newOptions = getOptions();
    setSourceOptions(newOptions);

    if (
      !newOptions.find(item => item.key === sourceToken) &&
      newOptions.length
    ) {
      setSourceToken(newOptions[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);
  const chainOptions = [
    {
      key: 'Ethereum',
      label: 'Ethereum',
    },
    {
      key: 'Binance',
      label: 'Binance',
    },
  ];

  return (
    <Dialog isOpen={show} onClose={() => setShow(false)}>
      <div className="mx-auto" style={{ width: 320 }}>
        <p className="mb-1">Select Chain:</p>
        <Select
          value={chain}
          onChange={value => setChain(value)}
          options={chainOptions as any}
          valueRenderer={(item: Option) => (
            <Text ellipsize className="tw-text-center">
              {item.label}
            </Text>
          )}
        />

        <p className="mt-4 mb-1">Choose Coin:</p>
        <SwapAssetSelector
          value={sourceToken}
          items={sourceOptions}
          onChange={value => setSourceToken(value.key)}
        />

        <p className="text-center tw-w-full tw-text-sm tw-opacity-60">
          Powered by BabelFish
        </p>
      </div>
    </Dialog>
  );
}
