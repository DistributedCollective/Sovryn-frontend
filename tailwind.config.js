module.exports = {
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
    extend: {},
  },
  variants: {
    opacity: ['responsive', 'hover'],
    extend: {},
  },
  plugins: [],
};
