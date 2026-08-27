/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        // Paleta extraída de la maqueta
        brand: {
          50: '#EFF5FF', 100: '#DBE8FE', 200: '#BFD7FE', 300: '#93BBFD',
          400: '#6096FA', 500: '#2563EB', 600: '#1D4ED8', 700: '#1E40AF',
          800: '#1E3A8A', 900: '#172554',
        },
        ink: { DEFAULT: '#0B1B3A', soft: '#334166', muted: '#6B7899' },
        success: { 500: '#16A34A', 100: '#DCFCE7' },
        amber:   { 500: '#F59E0B', 100: '#FEF3C7' },
        surface: { DEFAULT: '#FFFFFF', subtle: '#F6F9FF', line: '#E6EDF9' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(11,27,58,.04), 0 8px 24px rgba(11,27,58,.06)',
        lift: '0 12px 40px rgba(29,78,216,.18)',
        glass: '0 8px 32px rgba(11,27,58,.10)',
      },
      keyframes: {
        float:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        sheen:  { '0%': { transform: 'translateX(-120%)' }, '100%': { transform: 'translateX(220%)' } },
        marquee:{ '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseRing: { '0%': { boxShadow: '0 0 0 0 rgba(37,99,235,.45)' }, '100%': { boxShadow: '0 0 0 18px rgba(37,99,235,0)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        sheen: 'sheen 1.1s ease-out',
        marquee: 'marquee 32s linear infinite',
        pulseRing: 'pulseRing 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
