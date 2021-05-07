import React, { useMemo } from 'react';
import { Nullable } from 'types';
import { Asset } from 'types/asset';
import { Select } from 'form/Select';
import { Option } from 'form/Select/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { renderItem, valueRenderer } from 'form/AssetSelect/renderers';

interface Props {
  value: Nullable<Asset> | undefined;
  onChange: (value: Asset, item: Option) => void;
  options: Asset[];
  placeholder?: React.ReactNode;
}

export function AssetSelect(props: Props) {
  const options = useMemo(() => {
    return props.options.map(item => {
      const asset = AssetsDictionary.get(item);
      return { key: item, label: asset.symbol, data: asset.logoSvg };
    });
  }, [props.options]);
  return (
    <Select
      value={props.value as any}
      onChange={(value, option) =>
        props.onChange(value as Asset, option as any)
      }
      options={options as any}
      itemRenderer={renderItem}
      valueRenderer={valueRenderer}
    />
  );
}
