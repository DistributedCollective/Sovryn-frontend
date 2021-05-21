import styled from 'styled-components';

export enum LootDropColors {
  Purple = '#6063CC',
  Yellow = '#F5E884',
  Green = '#6DAC6F',
  Pink = '#D69B9B',
  Blue = '#8EDBDB',
}

export const LootDropWrapper = styled.div`
  background: transparent
    radial-gradient(closest-side at 50% 105%, #e9eae9 0%, #222222 100%) 0% 0%
    no-repeat;
  mix-blend-mode: lighten;
  width: 304px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin: 0 0.625rem;
`;

interface IHighlightedBorderProps {
  highlightColor: LootDropColors;
}

export const HighlightedBorder = styled.div<IHighlightedBorderProps>`
  width: 100%;
  height: 0.5625rem;
  background-color: ${props => props.highlightColor};
`;
