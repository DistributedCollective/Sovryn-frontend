import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { SlippageForm } from '../../SlippageForm';
import { EditPositionSizeDialogStep } from '../types';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { translations } from '../../../../../../locales/i18n';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import styles from '../index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../../selectors';
import {
  isPerpetualTrade,
  PerpetualPageModals,
  PerpetualTrade,
} from '../../../types';
import { actions } from '../../../slice';
import { EditPositionSizeDialogContext } from '..';

export const SlippageFormStep: TransitionStep<EditPositionSizeDialogStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const { changedTrade, onChange } = useContext(EditPositionSizeDialogContext);

  const onCloseSlippage = useCallback(
    () =>
      changeTo(
        EditPositionSizeDialogStep.trade,
        TransitionAnimation.slideRight,
      ),
    [changeTo],
  );
  const onChangeSlippage = useCallback(
    slippage =>
      changedTrade &&
      onChange({
        ...changedTrade,
        slippage,
      }),
    [onChange, changedTrade],
  );

  const minEntryPrice = useMemo(() => {
    // TODO: implement minEntryPrice calculation
    return 1337.1337;
  }, []);

  const minLiquidationPrice = useMemo(() => {
    // TODO: implement minLiquidationPrice calculation
    return 1337.1337;
  }, []);

  return (
    <div>
      <h3 className="tw-relative tw-mb-12 tw-text-center tw-text-base tw-font-medium tw-normal-case tw-leading-normal">
        <button
          className="tw-absolute tw-left-0 tw-top-0"
          onClick={onCloseSlippage}
        >
          <img
            className="tw-transform tw-rotate-180"
            src={iconArrowForward}
            alt="Back"
            title="Back"
          />
        </button>
        {t(translations.perpetualPage.tradeForm.titles.slippage)}
      </h3>
      <SlippageForm
        slippage={changedTrade?.slippage || 0.5}
        onChange={onChangeSlippage}
      />
    </div>
  );
};
