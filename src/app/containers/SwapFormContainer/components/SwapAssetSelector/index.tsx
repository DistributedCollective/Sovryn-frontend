/**
 *
 * SwapAssetSelector
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Select } from '@blueprintjs/select';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Nullable } from 'types';
import {
  areOptionsEqual,
  filterItem,
  renderItem,
  SelectItem,
} from 'app/components/FormSelect';
import { MenuItem, Text } from '@blueprintjs/core';
import { StyledButton, StyledAssetLogo, CaretElement } from './styled';
import { useBorrowAssetPrice } from '../../../../hooks/trading/useBorrowAssetPrice';
import { Asset } from '../../../../../types/asset';
import { weiTo2 } from '../../../../../utils/blockchain/math-helpers';
import { isMobile } from '../../../../../utils/helpers';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';

const Selector = Select.ofType<SelectItem>();

interface Props {
  value: Nullable<any>;
  items: Array<SelectItem>;
  placeholder: string;
  onChange: (customer: SelectItem) => void;
  innerClasses?: string;
  inputFocus?: boolean;
}

export function SwapAssetSelector(props: Props) {
  const { t } = useTranslation();

  const onItemSelect = item => props.onChange(item);

  const getSelected = useCallback(() => {
    return props.items.find(item => String(item.key) === String(props.value));
  }, [props.items, props.value]);

  const [selected, setSelected] = useState<SelectItem | undefined>(
    getSelected(),
  );

  useEffect(() => {
    setSelected(getSelected());
  }, [getSelected, props.value, props.items]);

  const { value: price, loading } = useBorrowAssetPrice(
    props.value,
    Asset.USDT,
  );

  return (
    <Selector
      items={props.items}
      inputProps={isMobile() ? { autoFocus: false } : undefined}
      noResults={
        <MenuItem
          disabled={true}
          text={
            !props.items
              ? t(translations.formSelect.loading)
              : t(translations.formSelect.noresults)
          }
        />
      }
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      onItemSelect={onItemSelect}
      itemsEqual={areOptionsEqual}
      activeItem={selected}
      popoverProps={{
        targetTagName: 'div',
      }}
    >
      <StyledButton>
        <span className="px-3 pr-4 d-flex flex-row align-items-center justify-content-between flex-shrink-0 flex-grow-1">
          {selected ? (
            <>
              <span className="d-flex flex-row justify-content-start align-items-center flex-shrink-0 flex-grow-1">
                <StyledAssetLogo
                  src={AssetsDictionary.get(props.value).logoSvg}
                />
                <Text ellipsize>{`1 ${props.value}`}</Text>
                <span className="px-1">≈</span>
                <Text
                  ellipsize
                  className={[
                    'flex-shrink-1 flex-grow-0',
                    loading ? 'bp3-skeleton' : '',
                  ].join(' ')}
                >
                  {weiTo2(price)}
                </Text>
              </span>
            </>
          ) : (
            <Text ellipsize>Select trade pair</Text>
          )}
        </span>
        <CaretElement>
          <img src={arrowDownIcon} alt="arrow-down" />
        </CaretElement>
      </StyledButton>
    </Selector>
  );
}

SwapAssetSelector.defaultProps = {
  placeholder: 'Select something',
  innerClasses: 'border rounded',
};
