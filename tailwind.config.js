/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
      },
    },
  },
  plugins: [],
}
