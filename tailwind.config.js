@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font and smoothing settings */
body {
  font-family: 'Inter', 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #ffffff;
  color: #111827; /* Tailwind gray-900 for readability */
}

/* Custom scrollbar (optional enhancement) */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f3f4f6; /* Tailwind gray-100 */
}
::-webkit-scrollbar-thumb {
  background: #9ca3af; /* Tailwind gray-400 */
  border-radius: 4px;
}

