import styled from 'styled-components';

export enum LootDropColors {
  Purple = '#6063CC',
  Yellow = '#F5E884',
  Green = '#6DAC6F',
  Pink = '#D69B9B',
  Blue = '#8EDBDB',
  Orange = '#db6e4d',
}

export const LootDropWrapper = styled.div`
  background: radial-gradient(
    circle,
    rgb(233 234 233 / 12%) 3%,
    rgba(34, 34, 34, 1) 83%
  );
  mix-blend-mode: lighten;
  width: 310px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin: 0 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

interface IHighlightedBorderProps {
  highlightColor: LootDropColors;
}

export const HighlightedBorder = styled.div<IHighlightedBorderProps>`
  width: 100%;
  height: 0.5625rem;
  background-color: ${props => props.highlightColor};
`;
