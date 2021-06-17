import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Text } from '@blueprintjs/core';
import React from 'react';
import { Option } from 'app/components/Form/Select/types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types/asset';

export const renderItem: ItemRenderer<Option> = (
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
        <Text ellipsize>{highlightText(item.label || item.key, query)}</Text>
      }
    />
  );
};

export const renderItemNH: ItemRenderer<Option> = (
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
      text={<Text ellipsize>{item.label || item.key}</Text>}
    />
  );
};

const normalize = (text: string) =>
  text.replace('_', ' ').replace('-', ' ').replace(',', ' ');

export const filterItem: ItemPredicate<Option> = (
  query,
  item,
  _index,
  exactMatch,
) => {
  const normalizedTitle = String(item.label).toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    const query = normalize(normalizedQuery);
    const title = normalize(normalizedTitle);
    const key = normalize(String(item.key).toLowerCase());

    return `${title} ${key}`.indexOf(query) >= 0;
  }
};

export function areOptionsEqual(optionA: Option, optionB: Option) {
  return (
    optionA.key &&
    optionB.key &&
    optionA.key.toString() === optionB.key.toString()
  );
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

export const renderAssetPair: ItemRenderer<Option<string, Asset[], any>> = (
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
        <Text className="tw-text-center">
          <AssetRenderer asset={item.label[0]} /> -{' '}
          <AssetRenderer asset={item.label[1]} />
        </Text>
      }
    />
  );
};
