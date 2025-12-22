/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: '#DC2626',
        doctor: '#2563EB',
        rib: '#7C3AED',
        lab: '#059669',
        nurse: '#DB2777',
        patient: '#EA580C',
        external: '#64748B',
      },
    },
  },
  plugins: [],
}
