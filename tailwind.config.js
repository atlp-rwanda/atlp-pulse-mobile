/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  
  theme: {
    extend:{
    colors: {
      primary: {
        light:'var(--color-primary-light)',       
        dark:'var(--color-primary-dark)',
      },
      secondary:{
        light:{
          900:'var(--color-secondary-light-900)',
          800:'var(--color-secondary-light-800)',
          700:'var(--color-secondary-light-700)',
          600:'var(--color-secondary-light-600)',
          500:'var(--color-secondary-light-500)',
          400:'var(--color-secondary-light-400)',
          300:'var(--color-secondary-light-300)',
          200:'var(--color-secondary-light-200)',
          100:'var(--color-secondary-light-100)',
          50:'var(--color-secondary-light-50)'
        },
        dark:{
          900:'var(--color-secondary-dark-900)',
          800:'var(--color-secondary-dark-800)',
          700:'var(--color-secondary-dark-700)',
          600:'var(--color-secondary-dark-600)',
          500:'var(--color-secondary-dark-500)',
          400:'var(--color-secondary-dark-400)',
          300:'var(--color-secondary-dark-300)',
          200:'var(--color-secondary-dark-200)',
          100:'var(--color-secondary-dark-100)',
          50:'var(--color-secondary-dark-50)'
        }
      },
      action:{
        900:'var(--color-action-900)',
        800:'var(--color-action-800)',
        700:'var(--color-action-700)',
        600:'var(--color-action-600)',
        500:'var(--color-action-500)',
        400:'var(--color-action-400)',
        300:'var(--color-action-300)',
        200:'var(--color-action-200)',
        100:'var(--color-action-100)',
        50:'var(--color-action-50)'
      },
      success:{
        900:'var(--color-success-900)',
        800:'var(--color-success-800)',
        700:'var(--color-success-700)',
        600:'var(--color-success-600)',
        500:'var(--color-success-500)',
        400:'var(--color-success-400)',
        300:'var(--color-success-300)',
        200:'var(--color-success-200)',
        100:'var(--color-success-100)',
        50:'var(--color-success-50)'
      },
      warning:{
        900:'var(--color-warning-900)',
        800:'var(--color-warning-800)',
        700:'var(--color-warning-700)',
        600:'var(--color-warning-600)',
        500:'var(--color-warning-500)',
        400:'var(--color-warning-400)',
        300:'var(--color-warning-300)',
        200:'var(--color-warning-200)',
        100:'var(--color-warning-100)',
        50:'var(--color-warning-50)'
      },
      error:{
        900:'var(--color-danger-900)',
        800:'var(--color-danger-800)',
        700:'var(--color-danger-700)',
        600:'var(--color-danger-600)',
        500:'var(--color-danger-500)',
        400:'var(--color-danger-400)',
        300:'var(--color-danger-300)',
        200:'var(--color-danger-200)',
        100:'var(--color-danger-100)',
        50:'var(--color-danger-50)'
      },
      neutral:{
        900:'var(--color-neutral-900)',
        800:'var(--color-neutral-800)',
        700:'var(--color-neutral-700)',
        600:'var(--color-neutral-600)',
        500:'var(--color-neutral-500)',
        400:'var(--color-neutral-400)',
        300:'var(--color-neutral-300)',
        200:'var(--color-neutral-200)',
        100:'var(--color-neutral-100)',
        50:'var(--color-neutral-50)'
      }
    },
   fontFamily: {
        "Inter-Regular": ["Inter_400Regular"],
        "Inter-Medium": ["Inter_500Medium"],
        "Inter-SemiBold": ["Inter_600SemiBold"],
        "Inter-Bold": ["Inter_700Bold"],
      },
  },
},
  plugins: [

  ],
}
