/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./admin.html",
        "./*.tsx",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'padang-green': '#006400',
                'golden-maroon': '#800020',
                'chili-red': '#FF4500',
                'off-white': '#F9F9F9',
            },
            borderRadius: {
                'xl-custom': '12px',
            },
            animation: {
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'bounce-dramatic': 'bounce-dramatic 0.6s infinite',
                'shadow-pulse': 'shadow-pulse 0.6s infinite',
                'sos-pulse': 'sos-pulse 2s infinite',
            },
            keyframes: {
                'bounce-dramatic': {
                    '0%, 100%': {
                        transform: 'translateY(0) scale(1.25)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateY(-35px) scale(1.25) rotate(5deg)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                },
                'shadow-pulse': {
                    '0%, 100%': {
                        transform: 'scale(0.6)',
                        opacity: '0.1',
                    },
                    '50%': {
                        transform: 'scale(1.4)',
                        opacity: '0.4',
                    },
                },
                'sos-pulse': {
                    '0%': {
                        boxShadow: '0 0 0 0 rgba(255, 69, 0, 0.6)',
                    },
                    '70%': {
                        boxShadow: '0 0 0 15px rgba(255, 69, 0, 0)',
                    },
                    '100%': {
                        boxShadow: '0 0 0 0 rgba(255, 69, 0, 0)',
                    },
                },
            },
        },
    },
    plugins: [],
}
