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
      },
    },
  },
  plugins: [],
} satisfies Config;
