/**
 *
 * AmountField
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { handleNumberInput } from 'utils/helpers';
import { translations } from 'locales/i18n';
import { InputField } from 'app/components/InputField';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onMaxClicked: () => void;
  allowNegative?: boolean;
  hideMaxButton?: boolean;
  rightElement?: React.ReactNode;
  dataActionId?: string;
}

export function AmountField(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <InputField
        type="text"
        value={props.value}
        placeholder={t(translations.amountField.placeholder)}
        onChange={e =>
          props.onChange(handleNumberInput(e, !props.allowNegative))
        }
        rightElement={
          <>
            {!props.hideMaxButton && !props.rightElement && (
              <button
                className="btn"
                type="button"
                onClick={() => props.onMaxClicked()}
              >
                {t(translations.amountField.btn_max)}
              </button>
            )}
            {props.rightElement && <>{props.rightElement}</>}
          </>
        }
        dataActionId={props.dataActionId}
      />
    </>
  );
}

AmountField.defaultProps = {
  allowNegative: false,
  hideMaxButton: false,
  onMaxClicked: () => {},
};
