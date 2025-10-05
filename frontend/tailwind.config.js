/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal: Blanco, Azul y Celeste
        primary: {
          DEFAULT: '#1E40AF', // Azul profundo
          light: '#3B82F6',   // Azul vibrante
          dark: '#1E3A8A',    // Azul más oscuro
        },
        'primary-dark': '#1E3A8A', // Alias para gradientes
        accent: {
          DEFAULT: '#60A5FA', // Celeste
          light: '#93C5FD',   // Celeste claro
          dark: '#3B82F6',    // Celeste oscuro
        },
        'accent-dark': '#3B82F6', // Alias para accent-dark
        secondary: {
          DEFAULT: '#1F2937', // Gris oscuro para textos
          light: '#6B7280',   // Gris medio
        },
        // Colores de soporte
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          DEFAULT: '#3B82F6',
        },
        white: '#FFFFFF',
        black: '#111827',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          light: '#F3F4F6',
          DEFAULT: '#6B7280',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
};
