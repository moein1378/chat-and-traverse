/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'whatsapp-pattern': "url('https://wallpapers.com/images/hd/whatsapp-chat-background-fb34cc4b2hg9lmix.jpg')",
      }
    },
  },
  plugins: [],
}