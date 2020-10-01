/**
 *
 * FormSelect
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select';
import { Button, MenuItem } from '@blueprintjs/core';
import { Nullable } from 'types';

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
      className="p-0 w-100 background-Field_bg"
      items={props.items}
      noResults={
        <MenuItem
          disabled={true}
          text={
            props.loading && !props.items
              ? 'Loading, please wait.'
              : 'No results.'
          }
        />
      }
      filterable={props.filterable}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      onItemSelect={onItemSelect}
      itemsEqual={areOptionsEqual}
      activeItem={selected}
    >
      <Button
        fill
        rightIcon="caret-down"
        text={selected ? selected.label : props.placeholder}
      />
    </Selector>
  );
}

FormSelect.defaultProps = {
  loading: false,
  filterable: true,
  placeholder: '(No Selection)',
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
      text={highlightText(item.label, query)}
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
