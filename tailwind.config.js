module.exports = {
  prefix: 'tw-',
  purge: ['./src/components/**/*.{ts,tsx}', './src/containers/**/*.{ts,tsx}'],
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
    },
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#EDB305',
      secondary: '#2274A5',
      white: '#e9eae9',
      black: '#000000',
      dark: {
        DEFAULT: '#191919',
      },
      green: '#17C3B2',
      red: '#D74E09',
      muted: '#656565',

      // new
      transparent: 'transparent',
      black: '#000',
      'dark-gray': '#656565',
      'light-gray': '#D9D9D9',
      white: '#fff',
      black: '#000',
      red: '#eb2106',
      green: '#00ce7d',
      teal: '#4ecdc4',
      gold: '#fec004',
      gold5: rgba(254, 192, 4, 0.05),
      gold25: rgba(254, 192, 4, 0.25),
      gold35: rgba(254, 192, 4, 0.35),
      gold50: rgba(254, 192, 4, 0.5),
      primary: '#171717',
      secondary: '#2d2d2d',

      Teal: '#4ecdc4',
      background: '#171717',
      'secondary-bg': '#414042',
      'component-bg': '#0b223b',
      Gold: '#fec004',
      Field_bg: '#05182e',
      Green: '#00ce7d',
      Red: '#eb2106',
      Muted_red: '#cd4e4e',
      Grey_text: '#586c86',
      LightGrey: '#a9bacd',
      MediumGrey: '#7b96b5',
      TabGrey: '#213b58',

      'sales-background': '#181818',

      // theme colors
      'black': '#000',
      'muted': '#656565',
      'long': '#4ecdc4',
      'short': '#cd4e4e',
      'dark-gray': '#656565',
      'light-gray': '#656565',
      'teal': '#4ecdc4',
      'gold': '#fec004',
      'red': '#eb2106',
      'green': '#00ce7d',
      'customOrange': '#ff9931',
      'Gold': '#fec004',
      'customTeal': '#4ecdc4',
      'lightGrey': '#a9bacd',
      'MediumGrey': '#7b96b5',
      'Grey_text': '#586c86',
      'primaryBackground': '#192b41',
      'secondaryBackground': '#414042',
      'fieldBackground': '#05182e',
      'component-bg': '#0b223b',
      'TabGrey': '#213b58',
      'Red': '#eb2106',
      'Muted_red': '#cd4e4e',
      'info': '#17a2b8'
    },
    extend: {},
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
      }),
    },
  ],
},
