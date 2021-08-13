module.exports = {
  prefix: 'tw-',
  important: true,
  purge: [
    './src/app/components/**/*.{ts,tsx}',
    './src/app/containers/**/*.{ts,tsx}',
    './src/app/pages/**/*.{ts,tsx}',
  ],
  future: {
    purgeLayersByDefault: true,
  },
  // darkMode: 'media', // 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1536px',
      '3xl': '1854px',
    },
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
      orbitron: ['Orbitron', 'sans-serif'],
    },
    fontSize: {
      tiny: '.7rem',
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '4-5xl': '2.5rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    colors: {
      // new
      primary: '#fec004',
      'primary-hover': '#fec00440',
      secondary: '#2274A5',
      gray: {
        1: '#333333',
        2: '#191919',
        100: '#1f1f1f',
        200: '#2F2F2F',
        300: '#EDEDED',
        600: '#F4F4F4',
        700: '#191919',
        800: '#282828',
        900: '#686868',
        dark: '#707070',
        light: '#181818',
        lighter: '#161616',
      },
      white: '#E9EAE9',
      black: '#000000',
      input: '#2274A5',
      tradingLong: '#17C3B2',
      tradingShort: '#D74E09',
      overlay: '#333333',
      dAppBackground: '#191919',

      transparent: 'transparent',
      current: 'currentColor',
      // primary: '#EDB305',
      // secondary: '#2274A5',
      // white: '#e9eae9',
      // black: '#000000',
      dark: {
        1: '#575757',
        DEFAULT: '#191919',
        2: '#101010',
      },
      // green: '#17C3B2',
      // red: '#D74E09',

      // new
      Teal: '#4ecdc4',
      foreground: '#D9D9D9',
      background: '#171717',
      'secondary-bg': '#414042',
      Field_bg: '#05182e',
      Green: '#00ce7d',
      LightGrey: '#a9bacd',

      'sales-background': '#181818',

      // theme colors
      // black: '#000',
      muted: '#656565',
      long: '#4ecdc4',
      short: '#cd4e4e',
      'dark-gray': '#656565',
      'light-gray': '#656565',
      gray_bg: '#404040',
      teal: '#4ecdc4',
      red: '#eb2106',
      error: '#A52222',
      green: '#00ce7d',
      customOrange: '#ff9931',
      customTeal: '#4ecdc4',
      lightGrey: '#a9bacd',
      MediumGrey: '#7b96b5',
      Grey_text: '#586c86',
      primaryBackground: '#192b41',
      secondaryBackground: '#414042',
      fieldBackground: '#05182e',
      'component-bg': '#0b223b',
      TabGrey: '#213b58',
      Red: '#eb2106',
      Muted_red: '#cd4e4e',
      info: '#17a2b8',
      turquoise: '#4ECDC4',
      theme: {
        white: '#E9EAE9',
        blue: '#2274A5',
      },
    },
    extend: {
      maxWidth: {
        '7.5rem': '7.5rem',
        '8.75rem': '8.75rem',
        '13rem': '13rem',
        '20rem': '20rem',
        '20.5rem': '20.5rem',
        '28.75rem': '28.75rem',
        '31.25rem': '31.25rem',
        '40': '40%',
        '45': '45%',
        '50': '50%',
        '65': '65%',
        '70': '70%',
        '75': '75%',
        '77': '77%',
        '80': '80%',
        '90': '90%',
      },
      width: {
        '100': '25rem',
        '139': '34.75rem',
        '155': '38.75rem',
        '163': '40.75rem',
      },
      minWidth: {
        '122': '30.5rem',
      },
      height: {
        '88': '22rem',
      },
      lineHeight: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        '5px': '0.3125rem',
        '10px': '0.625rem',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  variants: {
    opacity: ['responsive', 'hover'],
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          paddingRight: '1rem',
          paddingLeft: '1rem',
          marginRight: 'auto',
          marginLeft: 'auto',
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '540px',
          },
          '@screen md': {
            maxWidth: '720px',
          },
          '@screen lg': {
            maxWidth: '960px',
          },
          '@screen xl': {
            maxWidth: '1920px',
          },
          '@screen 2xl': {
            maxWidth: '1920px',
          },
        },
      });
    },
  ],
};
