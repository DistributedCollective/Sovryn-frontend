/**
 *
 * LeverageSelector
 *
 */
import React, { useCallback, useEffect, useMemo } from 'react';
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

export function LeverageSelector({
  min,
  max,
  value,
  onChange,
  position,
}: Props) {
  const { t } = useTranslation();

  const items = useMemo(
    () => Array.from(Array(max + 1 - min), (_, i) => i + min),
    [min, max],
  );

  const bindOnChange = useCallback((value: number) => () => onChange(value), [
    onChange,
  ]);

  // In case active leverage becomes unavailable, set leverage to first available.
  useEffect(() => {
    if (!items.includes(value)) {
      onChange(items[0]);
    }
  }, [items, onChange, value]);

  const color = position === 'LONG' ? 'var(--teal)' : 'var(--Muted_red)';

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
    <div className="tw-grid tw-grid-cols-12 tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center">
      <div className="tw-col-span-12 lg:tw-col-span-4 tw-font-bold font-size-lg tw-mb-4 lg:tw-mb-0">
        <LeverageText>{t(translations.leverageSelector.text)}</LeverageText>
      </div>
      <div className="tw-col-span-12 lg:tw-col-span-8">
        <div className="tw-inline-flex tw-justify-between tw-items-start tw-w-full">
          {items.map(item => (
            <ThemeProvider
              theme={value === item ? active : inactive}
              key={item}
            >
              <div>
                <Button onClick={bindOnChange(item)} className="btn">
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
