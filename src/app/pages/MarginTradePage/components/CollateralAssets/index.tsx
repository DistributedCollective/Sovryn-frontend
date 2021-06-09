import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RadioGroup from 'app/components/Form/RadioGroup';
import { FormGroup } from 'app/components/Form/FormGroup';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';

interface Items {
  value: Asset;
  image: string;
  name: string;
}

interface Props {
  value: Asset;
  onChange: (value: Asset) => void;
  options: Asset[];
  label?: React.ReactNode;
}

export function CollateralAssets({ value, onChange, options, label }: Props) {
  const { t } = useTranslation();

  const items: Items[] = useMemo(() => {
    return (options
      .map(item => {
        const asset = AssetsDictionary.get(item);
        if (asset) {
          return {
            value: item,
            image: asset.logoSvg,
            name: asset.symbol,
            curAsset: asset.asset,
          };
        }
        return null;
      })
      .filter(item => !!item) as unknown) as Items[];
  }, [options]);

  return (
    <>
      <FormGroup
        label={label || t(translations.marginTradePage.tradeForm.labels.asset)}
      >
        <RadioGroup
          value={value}
          onChange={value => onChange(value as Asset)}
          className="tw-radio-group--secondary"
        >
          {items.map((item, idx) => (
            <RadioGroup.Button
              key={item.value}
              value={item.value}
              text={
                <>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="tw-mr-1 tw-w-6 tw-h-6 tw-object-fit"
                  />
                  <div className="tw-truncate tw-uppercase">
                    <AssetRenderer
                      asset={AssetsDictionary.get(options[idx]).asset}
                    />
                  </div>
                </>
              }
            />
          ))}
        </RadioGroup>
      </FormGroup>
    </>
  );
}
