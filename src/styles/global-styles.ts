import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    font-weight: 400;
    letter-spacing: 1.2px;
  }

  body {
    font-family: 'Work Sans', sans-serif;
    font-size: 16px;
    background-color: var(--background);
    color: white;
  }

  #root {
    min-height: 100vh;
    min-width: 100vw;
  }

  p,
  label {
    font-family: inherit;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
    background-color: var(--Field_bg);
    color: var(--white);
    border: none;
    &::selection {
      border: none;
    }
  }
  h1, h2, h3, h4 {
    text-transform: uppercase;
  }
  h1 {
    font-size: 30px;
    letter-spacing: 1.7px;
    font-weight: 500;
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
  }
  button {
    text-transform: uppercase;
    font-weight: 600;
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
  .data-label {
    padding: 8px 0;
    color: var(--Grey_text);
    font-size: 85%;
  }
  table {
    background-color: var(--component-bg);
    color: white;
    width: 100%;
    border: 1px solid var(--component-bg);
  }
  tr:nth-child(even) {
    background-color: var(--background)
  }
  .bp3-html-table {
    width: 100%;
    background-color: var(--component-bg);
    thead th {
        color: var(--Grey_text);
        text-transform: uppercase;
        border-bottom: 2px solid var(--background);
        @media (max-width: 1200px) {
          font-size: 80%;
        }
    }
    tbody tr td {
      color: white;
      font-weight: 300;
      padding: 10px 5px;
      text-align: center;
      @media (max-width: 1200px) {
        font-size: 90%;
      }
    }
  }
  .modal-title {
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.49px;
    text-transform: capitalize;
  }
  .bp3-input-group {
    .bp3-input {
      background-color: var(--Field_bg);
      color: var(--white);
      width: 100%;
    }
  }
  .bp3-popover-wrapper {
    .bp3-popover-target {
      width: 100%;
      button {
        width: 100%100%;
        background-color: var(--Field_bg);
        background-image: none;
        color: white;
        &:active {
          background-color: var(--Field_bg)
        }
      }
    }
  }
`;
