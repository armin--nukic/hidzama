/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        forest: 'rgb(var(--color-forest) / <alpha-value>)',
        sage: 'rgb(var(--color-sage) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        clay: 'rgb(var(--color-clay) / <alpha-value>)',
        pearl: 'rgb(var(--color-pearl) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 18px 50px rgba(23, 33, 29, 0.12)',
        glow: '0 24px 80px rgba(31, 92, 74, 0.18)'
      }
    }
  },
  plugins: []
};
