import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f8f4ed',
        traditional: {
          DEFAULT: '#8b3a2a',
          dark: '#3d1f0d',
          light: '#c4712a',
          bg: '#f5ede0',
        },
        navy: {
          DEFAULT: '#1e293b',
          light: '#334155',
        },
        difficulty: {
          easy: '#22c55e',
          normal: '#f59e0b',
          advanced: '#ef4444',
        },
      },
      fontFamily: {
        serif: ['Noto Serif KR', 'serif'],
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
