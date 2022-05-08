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
      tiny: '.625rem', //  10px
      xs: '.75rem', //     12px
      sm: '.875rem', //    14px
      base: '1rem', //     16px
      lg: '1.125rem', //   18px
      xl: '1.25rem', //    20px
      '2xl': '1.5rem', //  24px
      '3xl': '1.75rem', // 28px
      '4xl': '2.5rem', //  40px
      '5xl': '3.25rem', // 52px
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      'primary-300': '#F8F0BA',
      'primary-200': '#F8E37C',
      'primary-150': '#F8D33E',
      primary: '#fec004',
      'primary-75': '#DFA000', //'#fec004C0',
      'primary-50': '#AB7800', //'#fec00480',
      'primary-25': '#896000', //'#fec00440',
      'primary-10': '#563C00', //'#fec0041a',

      'secondary-300': '#9CE8FF',
      'secondary-200': '#47B9E5',
      'secondary-150': '#38A3D9',
      secondary: '#2A8FCC', //'#2274a5',
      'secondary-75': '#1B73B2', //'#2274a5C0',
      'secondary-50': '#0F5999', //'#2274a580',
      'secondary-25': '#064180', //'#2274a540',
      'secondary-10': '#042E59', //'#2274a51a',

      black: '#000000',
      'gray-1': '#161616',
      'gray-2': '#1f1f1f',
      'gray-2.5': '#222222', // newly added
      'gray-3': '#2c2c2c',
      'gray-4': '#343434',
      'gray-5': '#484848',
      'gray-6': '#5c5c5c',
      'gray-7': '#8e8e8e',
      'gray-8': '#a2a2a2',
      'gray-9': '#c4c4c4',
      'gray-10': '#d9d9d9',
      'sov-white': '#e8e8e8',
      white: '#ffffff',

      'trade-long-300': '#BFFFF9',
      'trade-long-200': '#52EBDC',
      'trade-long-150': '#30DBCA',
      'trade-long': '#17C3B2', // '#17C3B2',
      'trade-long-75': '#0FA8A1', // '#17C3B2C0',
      'trade-long-50': '#068F8F', // '#17C3B280',
      'trade-long-25': '#006F75', // '#17C3B240',
      'trade-long-10': '#00474F', // '#17C3B21a',

      'trade-short-300': '#FFB38D',
      'trade-short-200': '#FF9E6D',
      'trade-short-150': '#FF7A37',
      'trade-short': '#E75E19', // '#D74E09',
      'trade-short-75': '#C24615', // '#D74E09C0',
      'trade-short-50': '#9C3111', // '#D74E0980',
      'trade-short-25': '#75200D', // '#D74E0940',
      'trade-short-10': '#4F1209', // '#D74E091a',

      'success-300': '#80FF9B',
      'success-200': '#55F26A',
      'success-150': '#36D944',
      success: '#27BF2C', // '#27A522',
      'success-75': '#19A619', // '#27A522C0',
      'success-50': '#128C0E', // '#27A52280',
      'success-25': '#0D7306', // '#27A52240',
      'success-10': '#084D00', // '#27A5221a',

      'warning-300': '#FFCECC',
      'warning-200': '#FF8C80',
      'warning-150': '#FF5F57',
      warning: '#FF0000', // '#A52222',
      'warning-75': '#D9000B', // '#A52222C0',
      'warning-50': '#B20012', // '#A5222280',
      'warning-25': '#8C0015', // '#A5222240',
      'warning-10': '#660014', // '#A522221a',

      'yellow-1': '#F5E884',
      'yellow-2': '#DEB258',
      'blue-1': '#8EDBDB',
      'blue-2': '#628CB5',
      'orange-1': '#F7B199',
      'orange-2': '#DB6E4D',
      'green-1': '#95CA8F',
      'green-2': '#5AA897',
      'purple-1': '#8F91C3',
      'purple-2': '#7E64A7',
      'pink-1': '#C38FBB',
      'pink-2': '#A264A7',
    },
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray-3'),
    }),
    extend: {
      width: {},
      minWidth: theme => theme('width'),
      maxWidth: theme => theme('width'),
      height: {},
      minHeight: theme => theme('height'),
      maxHeight: theme => theme('height'),
      borderRadius: {
        '3xl': '1.25rem', // instead of 1.5rem, keeps the .25rem steps
      },
      borderWidth: {
        '6': '6px',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        'spin-fast': 'spin .5s linear infinite',
      },
    },
  },
  variants: {
    opacity: ['responsive', 'hover', 'active', 'focus'],
    zIndex: ['hover', 'active', 'focus'],
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
          '@screen xl': {
            maxWidth: '1920px',
          },
        },
      });
    },
  ],
};
