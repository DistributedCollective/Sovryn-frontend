import { ItemRenderer } from '@blueprintjs/select';
import { Option } from 'app/components/Form/Select/types';
import { MenuItem, Text } from '@blueprintjs/core';
import React from 'react';
import { highlightText } from 'app/components/Form/Select/renderers';

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
        <Text
          ellipsize
          tagName="div"
          className="tw-flex tw-flex-row tw-items-center tw-justify-start"
        >
          <img src={item.data} className="tw-w-6 tw-mr-2" alt={item.label} />
          {highlightText(item.label || item.key, query)}
        </Text>
      }
    />
  );
};

export const valueRenderer = (item: Option) => {
  return (
    <Text
      ellipsize
      tagName="div"
      className="tw-flex tw-flex-row tw-items-center tw-justify-start"
    >
      <img src={item.data} className="tw-w-6 tw-mr-2" alt={item.label} />
      {item.label || item.key}
    </Text>
  );
};
