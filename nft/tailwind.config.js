/** @type {import('tailwindcss').Config} */
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solana-green': '#14F195',
        'solana-purple': '#9945FF',
      },
    },
  },
  plugins: [],
}
