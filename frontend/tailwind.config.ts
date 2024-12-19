import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        background: '#101010',     
        sidebar: '#1A1A1A',        
        userBubble: '#2C2C2C',    
        aiBubble: '#202020',      
        text: '#E0E0E0',
        // //light theme
        // // lightBackground: '#FFFFFF',  
        // // lightSidebar: '#F1F1F1',     
        // // lightUserBubble: '#E0E0E0',  
        // // lightAiBubble: '#D9D9D9',    
        // // lightText: '#333333',
        // background: "var(--background)",
        // sidebar: "var(--sidebar)",
        // userBubble: "var(--userBubble)",
        // aiBubble: "var(--aiBubble)",
        // text: "var(--text)",

      },
    },
  },
  darkMode: 'class',
  plugins: [],
} satisfies Config;
