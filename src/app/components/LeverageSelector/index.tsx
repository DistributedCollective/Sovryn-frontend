/**
 *
 * LeverageSelector
 *
 */
import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  position: string;
}

export function LeverageSelector(props: Props) {
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

  const Button = styled.div`
    border-radius: 14.5px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2.4px;
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.color};
    border: ${props => props.theme.border};
    height: 30px;
    vertical-align: middle;
  `;

  const color = props.position === 'LONG' ? 'var(--Teal)' : 'var(--Gold)';

  const active = {
    color: color,
    textColor: 'var(--white)',
    border: 'none',
  };

  const inactive = {
    textColor: 'var(--Grey_text)',
    color: 'none',
    border: '1px solid var(--Grey_text)',
  };

  return (
    <div className="row">
      <div className="col-3">Leverage</div>
      <div className="col-9 d-inline-flex justify-content-between align-items-start h-75">
        {items.map(item => (
          <ThemeProvider theme={props.value === item ? active : inactive}>
            <Button onClick={() => props.onChange(item)} className="btn">
              <div>{item}X</div>
            </Button>
          </ThemeProvider>
        ))}
      </div>
    </div>
  );
}

LeverageSelector.defaultProps = {
  min: 1,
  max: 5,
  value: 1,
  onChange: (value: number) => {},
};
