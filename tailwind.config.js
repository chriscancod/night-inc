/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      black:       '#000000',
      white:       '#FFFFFF',
      transparent: 'transparent',
      gray: {
        100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4',
        400: '#A3A3A3', 500: '#737373', 600: '#525252',
        700: '#404040', 800: '#262626', 900: '#171717',
        950: '#0A0A0A',
      },
      'night-bg':     '#050505',
      'night-white':  '#F5F5F5',
      'night-orange': '#FF4D00',
      noctis:  { DEFAULT: '#FF8C00', dim: '#4A2800' },
      twoam:   { DEFAULT: '#00BFFF', dim: '#003F54' },
      apx:     { DEFAULT: '#8B5CF6', dim: '#2D1B6E' },
      clikey:  { DEFAULT: '#A8A9AD', dim: '#3A3B3F' },
      red:     { DEFAULT: '#EF4444', dim: '#450A0A' },
      green:   { DEFAULT: '#22C55E', dim: '#052E16' },
    },
    fontFamily: {
      mono: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
      sans: ['"Inter"', 'system-ui', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        'noctis':    '0 0 20px 2px rgba(255,140,0,0.35)',
        'noctis-lg': '0 0 48px 8px rgba(255,140,0,0.5)',
        'twoam':     '0 0 20px 2px rgba(0,191,255,0.35)',
        'apx':       '0 0 20px 2px rgba(139,92,246,0.35)',
        'clikey':    '0 0 20px 2px rgba(168,169,173,0.3)',
      },
      animation: {
        'spin-slow':  'spin 14s linear infinite',
        'flicker':    'flicker 5s steps(1) infinite',
        'blink':      'blink 1s step-end infinite',
        'scanline':   'scanline 7s linear infinite',
        'drift':      'drift 3s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%,95%,100%': { opacity: 1 },
          '96%': { opacity: 0.3 }, '97%': { opacity: 1 }, '99%': { opacity: 0.6 },
        },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        scanline: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        drift: { '0%': { transform: 'translateY(0px)' }, '100%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.neon-noctis':  { textShadow: '0 0 14px rgba(255,140,0,0.9), 0 0 36px rgba(255,140,0,0.4)' },
        '.neon-twoam':   { textShadow: '0 0 14px rgba(0,191,255,0.9), 0 0 36px rgba(0,191,255,0.4)' },
        '.neon-apx':     { textShadow: '0 0 14px rgba(139,92,246,0.9), 0 0 36px rgba(139,92,246,0.4)' },
        '.neon-clikey':  { textShadow: '0 0 14px rgba(168,169,173,0.8), 0 0 30px rgba(168,169,173,0.3)' },
        '.neon-white':   { textShadow: '0 0 10px rgba(255,255,255,0.7), 0 0 24px rgba(255,255,255,0.3)' },
        '.preserve-3d':  { transformStyle: 'preserve-3d' },
        '.scanlines': {
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
          pointerEvents: 'none',
        },
      })
    },
  ],
}
