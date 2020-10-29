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
          <button
            className="btn"
            type="button"
            onClick={() => props.onMaxClicked()}
          >
            {t(translations.amountField.btn_max)}
          </button>
        }
      />
    </>
    // <StyledWrapper>
    //   <div className="d-flex align-items-center">
    //     <InputField
    //       value={props.value}
    //       placeholder={t(translations.amountField.placeholder)}
    //       onChange={e =>
    //         props.onChange(handleNumberInput(e, !props.allowNegative))
    //       }
    //     />
    //   </div>
    //   <button
    //     className="btn"
    //     type="button"
    //     onClick={() => props.onMaxClicked()}
    //   >
    //     {t(translations.amountField.btn_max)}
    //   </button>
    // </StyledWrapper>
  );
}

AmountField.defaultProps = {
  allowNegative: false,
  onMaxClicked: () => {},
};
