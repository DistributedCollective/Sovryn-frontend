/**
 *
 * FormSelect
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select';
import { Icon, MenuItem, Text } from '@blueprintjs/core';
import { Nullable } from 'types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export type SelectItem = { key: any; label: any; [key: string]: any };

const Selector = Select.ofType<SelectItem>();

interface Props {
  value: Nullable<any>;
  items: Array<SelectItem>;
  loading: boolean;
  filterable: boolean;
  placeholder: string;
  onChange: (customer: SelectItem) => void;
}

export function FormSelect(props: Props) {
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

  return (
    <Selector
      className="w-100"
      items={props.items}
      noResults={
        <MenuItem
          disabled={true}
          text={
            props.loading && !props.items
              ? t(translations.formSelect.loading)
              : t(translations.formSelect.noresults)
          }
        />
      }
      filterable={props.filterable}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      onItemSelect={onItemSelect}
      itemsEqual={areOptionsEqual}
      activeItem={selected}
      popoverProps={{
        targetTagName: 'div',
      }}
    >
      <StyledSelection active={!!selected}>
        <Text ellipsize>{selected ? selected.label : props.placeholder}</Text>
        <Icon icon="caret-down" />
      </StyledSelection>
    </Selector>
  );
}

FormSelect.defaultProps = {
  loading: false,
  filterable: true,
  placeholder: 'Select something',
};

interface StyledProps {
  active: boolean;
}
const StyledSelection = styled.button.attrs(_ => ({
  type: 'button',
  className:
    'border rounded px-2 py-2 d-flex flex-row justify-content-between w-100 align-items-center',
}))`
  height: 48px;
  background-color: transparent;
  width: 100%;
  color: ${(props: StyledProps) =>
    props.active ? `var(--white)` : `var(--light-gray)`};
  font-size: 16px;
  letter-spacing: 0;
  text-transform: none;
  font-weight: normal;
`;

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
      text={<Text ellipsize>{highlightText(item.label, query)}</Text>}
    />
  );
};

export const filterItem: ItemPredicate<SelectItem> = (
  query,
  item,
  _index,
  exactMatch,
) => {
  const normalizedTitle = item.label.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${normalizedTitle} ${item.key}`.indexOf(normalizedQuery) >= 0;
  }
};

export function areOptionsEqual(optionA: SelectItem, optionB: SelectItem) {
  return optionA.key.toString() === optionB.key.toString();
}

export function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

export function escapeRegExpChars(text: string) {
  // eslint-disable-next-line no-useless-escape
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
