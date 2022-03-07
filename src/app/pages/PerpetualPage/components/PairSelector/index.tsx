import React, { useMemo } from 'react';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { getCollateralName, getCollateralLogo } from '../../utils/renderUtils';
import { Asset } from '../../../../../types';
import { GsnSwitch } from '../GsnSwitch/GsnSwitch';
import { PairSelectorButton } from './PairSelectorButton';
import iconSettings from 'assets/images/settings-white.svg';
import { Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

type PairSelectorProps = {
  pair: PerpetualPair;
  collateral: Asset;
  onChange: (pair: PerpetualPairType) => void;
  onLayoutSettingsClick: () => void;
};

const perpetualPairs = PerpetualPairDictionary.list();

export const PairSelector: React.FC<PairSelectorProps> = ({
  pair,
  collateral,
  onChange,
  onLayoutSettingsClick,
}) => {
  const { t } = useTranslation();
  const [collateralLogo, collateralName] = useMemo(
    () => [getCollateralLogo(collateral), getCollateralName(collateral)],
    [collateral],
  );

  return (
    <div className="tw-w-full tw-bg-gray-3">
      <div className="tw-container tw-flex tw-flex-row">
        <div className="tw-flex tw-flex-row tw-items-center tw-w-56 tw-px-4 tw-py-1.5">
          <img
            className="tw-w-auto tw-h-7 tw-mr-2"
            src={collateralLogo}
            alt={collateralName}
          />
          <span className="tw-font-bold tw-text-sm">{collateralName}</span>
        </div>
        <div className="tw-flex tw-flex-row tw-items-center tw-flex-1">
          {perpetualPairs.map(entry => (
            <PairSelectorButton
              key={entry.id}
              pair={entry}
              isSelected={pair.id === entry.id}
              onSelect={onChange}
            />
          ))}
        </div>
        <div className="tw-flex tw-flex-row tw-items-center tw-px-4">
          <GsnSwitch />
          <Tooltip
            targetClassName="tw-flex"
            content={t(translations.perpetualPage.layoutDialog.title)}
          >
            <button onClick={onLayoutSettingsClick} className="tw-ml-8">
              <img src={iconSettings} alt="layout menu dialog" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
