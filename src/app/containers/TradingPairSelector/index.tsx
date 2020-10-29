/**
 *
 * TradingPairSelector
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select } from '@blueprintjs/select';
import {
  TradingPairDictionary,
  TradingPairType,
} from 'utils/trading-pair-dictionary';
import { selectTradingPage } from '../TradingPage/selectors';
import { actions } from '../TradingPage/slice';
import {
  areOptionsEqual,
  filterItem,
  renderItem,
  SelectItem,
} from 'app/components/FormSelect';
import { Icon, MenuItem, Text } from '@blueprintjs/core';
import { TradingPair } from '../../../utils/models/trading-pair';
import { StyledAssetLogo } from './styled';
import { useBorrowAssetPrice } from '../../hooks/trading/useBorrowAssetPrice';
import { Asset } from '../../../types/asset';
import { weiTo2 } from '../../../utils/blockchain/math-helpers';

const Selector = Select.ofType<SelectItem>();

const pairs = TradingPairDictionary.entries();

interface Props {
  onPairChange?: (value: TradingPairType) => void;
}

export function TradingPairSelector(props: Props) {
  const { tradingPair } = useSelector(selectTradingPage);

  const [options] = useState<SelectItem[]>(
    pairs.map(([key, pair]) => ({ key, label: pair.getName() })),
  );

  const getSelected = useCallback(() => {
    return options.find(item => String(item.key) === String(tradingPair));
  }, [options, tradingPair]);

  const [selected, setSelected] = useState<SelectItem | undefined>(
    getSelected(),
  );
  const [pair, setPair] = useState<TradingPair>(
    TradingPairDictionary.get(tradingPair),
  );

  const dispatch = useDispatch();

  const handlePairChange = useCallback(
    (value: SelectItem) => {
      dispatch(actions.changeTradingPair(value.key));
    },
    [dispatch],
  );

  useEffect(() => {
    setSelected(getSelected());
    setPair(TradingPairDictionary.get(tradingPair));
  }, [options, tradingPair, getSelected]);

  const { value: price, loading } = useBorrowAssetPrice(
    pair.getAsset(),
    Asset.DOC,
  );

  return (
    <Selector
      items={options}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      onItemSelect={handlePairChange}
      itemsEqual={areOptionsEqual}
      activeItem={selected}
      popoverProps={{
        targetTagName: 'div',
      }}
    >
      <button className="w-100 sovryn-border bg-dark text-white mb-4 d-flex flex-row justify-content-between align-items-center p-0">
        <span className="px-3 pr-4 d-flex flex-row align-items-center justify-content-between flex-shrink-0 flex-grow-1">
          {selected ? (
            <>
              <span className="d-flex flex-row justify-content-start align-items-center flex-shrink-0 flex-grow-1">
                <StyledAssetLogo src={pair.getAssetDetails().logoSvg} />
                <Text ellipsize>{pair.getName()}</Text>
              </span>
              <Text
                ellipsize
                className={[
                  'flex-shrink-1 flex-grow-0',
                  loading ? 'bp3-skeleton' : '',
                ].join(' ')}
              >
                <span className="text-muted">$</span> {weiTo2(price)}
              </Text>
            </>
          ) : (
            <Text ellipsize>Select trade pair</Text>
          )}
        </span>
        <span className="sovryn-border-left px-2 py-3 px-lg-4">
          <Icon icon="caret-down" />
        </span>
      </button>
      {/*<Button*/}
      {/*  fill*/}
      {/*  rightIcon="caret-down"*/}
      {/*  text={*/}
      {/*    <Text ellipsize>*/}
      {/*      {selected*/}
      {/*        ? TradingPairDictionary.get(selected.key)?.getName()*/}
      {/*        : '(Not selected)'}*/}
      {/*    </Text>*/}
      {/*  }*/}
      {/*/>*/}
    </Selector>
  );
}

TradingPairSelector.defaultProps = {
  onPairChange: _ => {},
};
