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
} from 'utils/dictionaries/trading-pair-dictionary';
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
import { isMobile } from '../../../utils/helpers';

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
      inputProps={isMobile() ? { autoFocus: false } : undefined}
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
      <button className="sovryn-border tw-w-full bg-dark tw-text-white tw-mb-4 tw-flex tw-flex-row tw-justify-between tw-items-center tw-p-0">
        <span className="tw-px-3 tw-pr-4 tw-flex tw-flex-row tw-items-center tw-justify-between tw-flex-shrink-0 tw-flex-grow">
          {selected ? (
            <>
              <span className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-flex-shrink-0 tw-flex-grow">
                <StyledAssetLogo src={pair.getAssetDetails().logoSvg} />
                <Text ellipsize>{pair.getName()}</Text>
              </span>
              <Text
                ellipsize
                className={[
                  'tw-flex-shrink tw-flex-grow-0',
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
        <span className="sovryn-border-left tw-px-2 tw-py-3 lg:tw-px-4">
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
