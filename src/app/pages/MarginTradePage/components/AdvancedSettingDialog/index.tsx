import cn from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FormGroup } from 'app/components/Form/FormGroup';

// import { translations } from '../../../BuySovPage/components/Slider';
// import { useMaintenance } from 'app/hooks/useMaintenance';
// import { TradingPosition } from 'types/trading-position';
// import { discordInvite } from 'utils/classifiers';

import { translations } from '../../../../../locales/i18n';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { Dialog } from '../../../../containers/Dialog';
// import { selectMarginTradePage } from '../../../../hooks/trading/useApproveAndTrade';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { SlippageSelector } from '../SlippageSelector';

export function AdvancedSettingDialog() {
  const { t } = useTranslation();
  const { position, amount, pairType, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  // const [slippage, setSlippage] = useState(0.5);
  const dispatch = useDispatch();

  // const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);

  return (
    <>
      <Dialog
        isOpen={!!position}
        onClose={() => dispatch(actions.closeTradingModal())}
      >
        <div className="tw-mw-340 tw-mx-auto">
          <div className="tw-mb-6 text-left">
            {t(translations.marginTradeForm.fields.advancedSettings)}
          </div>
          <div className="tw-text-sm tw-font-light tw-tracking-normal">
            <FormGroup
              label={t(translations.marginTradePage.tradeForm.labels.slippage)}
              className="tw-mb-6"
            >
              <SlippageSelector
                value={leverage}
                onChange={value => dispatch(actions.setLeverage(value))}
              />
            </FormGroup>
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.minLiq)}
              value={<>{toNumberFormat(leverage)}x</>}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

function LabelValuePair(props: LabelValuePairProps) {
  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-justify-between tw-space-x-4 tw-mb-2',
        props.className,
      )}
    >
      <div className="tw-truncate tw-w-7/12">{props.label}</div>
      <div className="tw-truncate tw-w-5/12 tw-text-right">{props.value}</div>
    </div>
  );
}
