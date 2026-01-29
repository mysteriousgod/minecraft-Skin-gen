/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#7FB238",     // Minecraft grass block green
          secondary: "#866043",   // Minecraft dirt block brown
          background: "#C6C6C6"   // Minecraft stone block grey
        },
        dark: {
          primary: "#527B24",     // Darker grass green
          secondary: "#523B28",   // Darker dirt brown
          background: "#1D1D1D"   // Minecraft bedrock dark
        }
      },
      backgroundColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
      },
      textColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
      },
      borderColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
      },
      ringColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
      },
      ringOffsetColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
      }
    },
  },
  plugins: [],
}
