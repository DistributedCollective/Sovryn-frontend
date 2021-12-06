import React, { useCallback, useEffect, useState } from 'react';
import { ItemRenderer, Select } from '@blueprintjs/select';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { weiToAssetNumberFormat } from 'utils/display-text/format';
import {
  areOptionsEqual,
  filterItem,
  SelectItem,
} from 'app/components/FormSelect';
import { MenuItem, Text } from '@blueprintjs/core';
import { StyledButton, CaretElement } from './styled';
import { isMobile } from '../../../../../utils/helpers';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';
import { AssetRenderer } from '../../../../components/AssetRenderer';

const Selector = Select.ofType<SelectItem>();

interface Props {
  value: Asset;
  items: Array<SelectItem>;
  placeholder: string;
  onChange: (customer: SelectItem) => void;
  innerClasses?: string;
  inputFocus?: boolean;
}

export function SwapAssetSelector(props: Props) {
  const { t } = useTranslation();

  const onItemSelect = useCallback(item => props.onChange(item), [props]);

  const getSelected = useCallback(() => {
    return props.items.find(item => String(item.key) === String(props.value));
  }, [props.items, props.value]);

  const [selected, setSelected] = useState<SelectItem | undefined>(
    getSelected(),
  );

  useEffect(() => {
    setSelected(getSelected());
  }, [getSelected, props.value, props.items]);

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
        <span className="tw-px-4 tw-pr-8 tw-flex tw-flex-row tw-items-center tw-justify-between tw-flex-shrink-0 tw-flex-grow">
          {selected ? (
            <>
              <span className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-flex-shrink-0 tw-flex-grow">
                <AssetRenderer imageSize={6} asset={props.value} showImage />
              </span>
            </>
          ) : (
            <Text ellipsize>{t(translations.formSelect.selectTradePair)}</Text>
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

export const renderItem: ItemRenderer<SelectItem> = (
  item,
  { handleClick, modifiers, query },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.key}
      onClick={handleClick}
      text={
        <Text ellipsize>
          <div className="tw-flex tw-flex-items-center tw-justify-between">
            <AssetRenderer asset={item.key} showImage imageSize={5} />{' '}
            <div className="tw-text-xs">
              {weiToAssetNumberFormat(item.value, item.key, 4)}
            </div>
          </div>
        </Text>
      }
    />
  );
};
