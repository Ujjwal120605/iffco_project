/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Swiss Aesthetic: Monochrome with subtle accents
                swiss: {
                    black: '#111111',
                    dark: '#222222',
                    gray: '#888888',
                    light: '#F5F5F5',
                    white: '#FFFFFF',
                    accent: '#0a4d2e' // Keeping IFFCO green as a subtle accent
                }
            },
            fontFamily: {
                sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                display: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'], // Stronger headings
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em',
            }
        },
    },
    plugins: [],
}
