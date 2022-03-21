import { createGlobalStyle } from 'styled-components/macro';
import { media } from './media';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    font-weight: 400;
  }
  html {
    overflow-x: auto !important;
  }

  body {
    font-family: var(--primary-font);
    font-size: 12px;
    background-color: var(--background);
    color: #D9D9D9;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-stroke: 0.45px;
    ${media.lg`
    font-size: 16px;
    `}
  }

  #root {
    min-height: 100vh;
    overflow: auto;
    padding-top: 4.4rem;
    &.openedMenu {
      overflow: hidden;
      height: 0;
      min-height: 0;
    }
  }

  p,
  label {
    font-family: inherit;
    line-height: 1.5em;
    letter-spacing: 0;
  }

  input, select {
    font-family: var(--secondary-font);
    font-size: 400;
    background-color: var(--primary);
    color: var(--white);
    border: none;
    &::selection {
      border: none;
    }
  }
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
  h1, h2, h3, h4 {
    text-transform: uppercase;
  }
  h1 {
    font-size: 30px;
    font-weight: 500;
  }
  h2 {
    text-transform: inherit;
    font-weight: 600;
    font-size: 1.75rem;
    margin: 0;
}
  h3 {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2.77px;
    color: inherit;
  }
  h4 {
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 2.92px;
    color: var(--Grey_text);
  }
  .font {
    &-xs {
      font-size: 12px;
    }
    &-sale-sm {
      font-size: 14px;
    }
  }
  button {
    padding: 0.23rem 4.2%4.2%;
  }
  .active {
    border-bottom: 1px solid var(--Teal);
    h4 {
      color: var(--Teal);
    }
  }
  .bordered {
    border: 1px solid var(--Grey_text);
  }
  .data-container {
    background-color: var(--Field_bg);
    padding: 8px 14px;
    &.bordered {
      border: 1px solid var(--Grey_text);
    }
  }
  .tw-w-full-input{
    width: 100%;
  }
  .data-label {
    padding: 8px 0;
    color: var(--Grey_text);
    font-size: 85%;
  }
  .modal-title {
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.49px;
    text-transform: capitalize;
  }
  #WEB3_CONNECT_MODAL_ID > div {
    z-index: 30;
  }
  :focus {
    outline: 0!important;
    outline-offset: 0;
  }
  .tw-cursor-pointer {
    cursor: pointer
  }
  .opaque {
    opacity: 0.2
  }

  .mw-tooltip {
    max-width: 250px;
    ${media.lg`max-width: 600px;`}
  }

`;
