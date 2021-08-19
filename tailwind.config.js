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
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#fec004',
      'primary-05': '#fec0040d',
      'primary-25': '#fec00440',
      'primary-50': '#fec00480',
      'primary-75': '#fec004C0',
      secondary: '#2274a5',
      'secondary-05': '#2274a50d',
      'secondary-25': '#2274a540',
      'secondary-50': '#2274a580',
      'secondary-75': '#2274a5C0',
      white: '#ffffff',
      'sov-white': '#e8e8e8',
      black: '#000000',
      'gray-1': '#161616',
      'gray-2': '#1f1f1f',
      'gray-3': '#2c2c2c',
      'gray-4': '#343434',
      'gray-5': '#484848',
      'gray-6': '#5c5c5c',
      'gray-7': '#8e8e8e',
      'gray-8': '#a2a2a2',
      'gray-9': '#c4c4c4',

      'trade-long': '#17C3B2',
      'trade-short': '#D74E09',

      red: '#eb2106',
      green: '#00ce7d',

      error: '#A52222',
      info: '#17a2b8',
    },
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray-3'),
    }),
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
