/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0a0f',
          surface: '#111118',
          card: '#16161e',
          border: '#2a2a3a',
          borderHover: '#3d3d55',
          text: '#c8c8d4',
          muted: '#6b6b80',
          accent: '#00e5a0',
          accentDim: '#00b37d',
          warning: '#f0c040',
          error: '#ff4466',
          info: '#40aaff',
          highlight: '#1a1a28',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderWidth: {
        '1': '1px',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'cursor': 'cursor 1.1s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan-line': 'scanLine 4s linear infinite',
        'tooltip-in': 'tooltipIn 0.15s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        cursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 2px rgba(0, 229, 160, 0.1)' },
          '100%': { boxShadow: '0 0 12px rgba(0, 229, 160, 0.15)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        tooltipIn: {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
