import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
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
  }
  h4 {
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 2.92px;
    color: var(--Grey_text);
  }
  .active {
    border-bottom: 1px solid var(--Teal);
    h4 {
      color: var(--Teal);
    }
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
        font-size: 16px;
        border-bottom: 2px solid var(--background);
    }
    tbody tr td {
      color: white;
      font-size: 16px;
      font-weight: 300;
      padding: 10px 5px;
      text-align: center;
    }
  }
`;
