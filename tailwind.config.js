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

      primary: '#fec004',
      'primary-75': '#fec004C0',
      'primary-50': '#fec00480',
      'primary-25': '#fec00440',
      'primary-10': '#fec0041a',

      secondary: '#2274a5',
      'secondary-75': '#2274a5C0',
      'secondary-50': '#2274a580',
      'secondary-25': '#2274a540',
      'secondary-10': '#2274a51a',

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
      'sov-white': '#e8e8e8',
      white: '#ffffff',

      'trade-long': '#17C3B2',
      'trade-long-75': '#17C3B2C0',
      'trade-long-50': '#17C3B280',
      'trade-long-25': '#17C3B240',
      'trade-long-10': '#17C3B21a',
      'trade-short': '#D74E09',
      'trade-short-75': '#D74E09C0',
      'trade-short-50': '#D74E0980',
      'trade-short-25': '#D74E0940',
      'trade-short-10': '#D74E091a',

      success: '#27A522',
      'success-75': '#27A522C0',
      'success-50': '#27A52280',
      'success-25': '#27A52240',
      'success-10': '#27A5221a',
      warning: '#A52222',
      'warning-75': '#A52222C0',
      'warning-50': '#A5222280',
      'warning-25': '#A5222240',
      'warning-10': '#A522221a',

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
          '@screen xl': {
            maxWidth: '1920px',
          },
        },
      });
    },
  ],
};
