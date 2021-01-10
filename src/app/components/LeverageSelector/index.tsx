/**
 *
 * LeverageSelector
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider } from 'styled-components/macro';
import { translations } from 'locales/i18n';

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  position: string;
}

export function LeverageSelector(props: Props) {
  const { t } = useTranslation();

  const items = Array.from(
    Array(props.max + 1 - props.min),
    (_, i) => i + props.min,
  );

  // In case active leverage becomes unavailable, set leverage to first available.
  useEffect(() => {
    if (!items.includes(props.value)) {
      props.onChange(items[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const color = props.position === 'LONG' ? 'var(--teal)' : 'var(--gold)';

  const active = {
    color: color,
    textColor: 'var(--white)',
    border: '1px solid' + color,
  };

  const inactive = {
    textColor: 'var(--dark-gray)',
    color: 'none',
    border: '1px solid var(--dark-gray)',
  };

  return (
    <div className="row d-flex flex-column flex-lg-row align-items-lg-center">
      <div className="col-12 col-lg-3 font-weight-bold font-size-lg mb-3 mb-lg-0">
        <LeverageText>{t(translations.leverageSelector.text)}</LeverageText>
      </div>
      <div className="col-12 col-lg-9">
        <div className="d-inline-flex justify-content-between align-items-start w-100">
          {items.map(item => (
            <ThemeProvider
              theme={props.value === item ? active : inactive}
              key={item}
            >
              <div>
                <Button onClick={() => props.onChange(item)} className="btn">
                  {item}X
                </Button>
              </div>
            </ThemeProvider>
          ))}
        </div>
      </div>
    </div>
  );
}

const Button = styled.button`
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2.4px;
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.color};
  border: ${props => props.theme.border};
  vertical-align: middle;
  padding: 5px 15px;
  &:hover {
    color: white;
    border-color: white;
  }
`;

const LeverageText = styled.div`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

LeverageSelector.defaultProps = {
  min: 1,
  max: 5,
  value: 1,
  onChange: (value: number) => {},
};
