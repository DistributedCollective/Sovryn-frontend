/**
 *
 * AmountField
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { handleNumberInput } from 'utils/helpers';
import { translations } from 'locales/i18n';
import styled from 'styled-components';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onMaxClicked: () => void;
  allowNegative: boolean;
}

export function AmountField(props: Props) {
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      <StyledInput
        value={props.value}
        placeholder={t(translations.amountField.placeholder)}
        onChange={e =>
          props.onChange(handleNumberInput(e, !props.allowNegative))
        }
      />
      <button
        className="btn"
        type="button"
        onClick={() => props.onMaxClicked()}
      >
        {t(translations.amountField.btn_max)}
      </button>
    </StyledWrapper>
  );
}

AmountField.defaultProps = {
  allowNegative: false,
  onMaxClicked: () => {},
};

const StyledWrapper = styled.label.attrs(_ => ({
  className: 'd-flex flex-row w-100 border rounded px-2 py-1',
}))`
  height: 48px;
`;

const StyledInput = styled.input.attrs(_ => ({
  type: 'text',
}))`
  background-color: transparent;
  width: 100%;
  color: var(--white);
  font-size: 16px;
  letter-spacing: 0;
  ::-webkit-input-placeholder {
    color: var(--light-gray);
  }
  :-ms-input-placeholder {
    color: var(--light-gray);
  }
  ::placeholder {
    color: var(--light-gray);
  }
`;
