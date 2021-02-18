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
    },
    extend: {},
  },
  variants: {
    opacity: ['responsive', 'hover'],
    extend: {},
  },
  plugins: [],
};
