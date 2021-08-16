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
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#fec004',
      'primary-hover': '#fec00440',
      secondary: '#2274A5',
      white: '#ffffff',
      'sov-white': '#E9EAE9',
      black: '#000000',
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
      lightGrey: '#a9bacd',
      Grey_text: '#586c86',
      muted: '#656565',
      gray_bg: '#404040',
      dAppBackground: '#191919',
      dark: {
        1: '#575757',
        DEFAULT: '#191919',
        2: '#101010',
      },

      foreground: '#D9D9D9',
      background: '#171717',

      long: '#4ecdc4',
      tradingLong: '#17C3B2',
      short: '#cd4e4e',
      tradingShort: '#D74E09',

      red: '#eb2106',
      green: '#00ce7d',

      error: '#A52222',
      info: '#17a2b8',
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
