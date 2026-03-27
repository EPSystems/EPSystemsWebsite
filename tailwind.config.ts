import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: '#B9FF66',
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'marquee-fast': 'marquee 10s linear infinite',
        'marquee-slow': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
