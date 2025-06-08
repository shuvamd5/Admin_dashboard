import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        'primary-hover': '#2980b9',
        text: '#333333',
        error: '#e74c3c',
        success: '#2ecc71',
        border: '#cccccc',
        'border-focus': '#3498db',
        disabled: '#cccccc',
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(#f0f8ff, #ffffff)',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;