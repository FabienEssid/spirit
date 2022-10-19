/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#ffe1ed',
                    100: '#ffb1c8',
                    200: '#ff7ea0',
                    300: '#ff4c75',
                    400: '#ff1a46',
                    500: '#e6003c',
                    600: '#b4003a',
                    700: '#810032',
                    800: '#500022',
                    900: '#21000e',
                },
            },
            flexGrow: {
                2: 2,
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
