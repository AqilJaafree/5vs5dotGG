
/** @type {import('tailwindcss').Config} */

export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'pulse-slower': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'ping-slow': 'ping 5s cubic-bezier(0, 0, 0.2, 1) infinite',
          'bounce-slow': 'bounce 5s infinite',
        },
      },
    },
    plugins: [
      // Add this custom plugin to create the scrollbar-hide utility
      function({ addUtilities }) {
        const newUtilities = {
          '.scrollbar-hide': {
            /* IE and Edge */
            '-ms-overflow-style': 'none',
            /* Firefox */
            'scrollbar-width': 'none',
            /* Hide scrollbar for Chrome, Safari and Opera */
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
        }
        
        addUtilities(newUtilities, ['responsive']);
      },
    ],
    safelist: [
      'bg-blue-700',
      'bg-purple-700',
      'bg-green-700',
      'bg-yellow-700',
      'bg-red-700',
      'text-blue-400',
      'text-purple-400',
      'text-green-400',
      'text-yellow-400',
      'text-red-400',
      'border-blue-500',
      'border-purple-500',
      'border-green-500',
      'border-yellow-500',
      'border-red-500',
      'bg-blue-900',
      'bg-purple-900',
      'bg-green-900',
      'bg-yellow-900',
      'bg-red-900',
      'shadow-blue-500/50',
      'shadow-purple-500/50',
      'shadow-green-500/50',
      'shadow-yellow-500/50',
      'shadow-red-500/50',
    ],
  }
  