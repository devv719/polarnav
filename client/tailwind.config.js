/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          bg: '#F4F8FB',
          card: '#FFFFFF',
          border: '#CCE0F0',
          'border-light': '#E2EEF8',
          primary: '#3385C6',
          'primary-light': '#66A3D3',
          'primary-dark': '#246699',
          text: '#1E3A52',
          heading: '#0F2130',
          muted: '#68869E',
          ice: '#E8F3FA',
          'ice-subtle': '#F0F6FA',
          cyan: '#00b4d8',
          accent: '#3385C6',
          frost: '#F8FBFE'
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        tech: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
