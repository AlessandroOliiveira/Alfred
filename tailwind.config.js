/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-dark': '#4F46E5',
        secondary: '#10B981',
        'secondary-dark': '#059669',
        accent: '#F59E0B',
        danger: '#EF4444',
        background: '#F3F4F6',
        'background-dark': '#1F2937',
        border: '#E5E7EB',
        'border-dark': '#374151',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-dark': '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
    },
  },
  plugins: [],
};
