import React, { useMemo } from 'react';
import { Nullable } from 'types';
import { Asset } from 'types/asset';
import { Select } from 'app/components/Form/Select';
import { Option } from 'app/components/Form/Select/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import {
  renderItem,
  valueRenderer,
} from 'app/components/Form/AssetSelect/renderers';

interface IAssetSelectProps {
  value: Nullable<Asset>;
  onChange: (value: Asset, item: Option<Asset, string, string>) => void;
  options: Asset[];
}

export const AssetSelect: React.FC<IAssetSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  const selectOptions = useMemo(() => {
    return options.map(item => {
      const asset = AssetsDictionary.get(item);
      return { key: item, label: asset.symbol, data: asset.logoSvg };
    });
  }, [options]);

  return (
    <Select
      value={value}
      onChange={(value, option) => onChange(value, option)}
      options={selectOptions}
      itemRenderer={renderItem}
      valueRenderer={valueRenderer}
    />
  );
};
