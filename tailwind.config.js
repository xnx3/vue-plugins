/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vue: {
          green: '#4fc08d',
          'green-dark': '#42b883',
          dark: '#2c3e50',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#4fc08d',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgba(75, 85, 99, 0.1)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'transparent',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'rgb(226 232 240)',
            '--tw-prose-headings': 'rgb(248 250 252)',
            '--tw-prose-lead': 'rgb(203 213 225)',
            '--tw-prose-links': '#4fc08d',
            '--tw-prose-bold': 'rgb(248 250 252)',
            '--tw-prose-counters': 'rgb(156 163 175)',
            '--tw-prose-bullets': 'rgb(75 85 99)',
            '--tw-prose-hr': 'rgb(55 65 81)',
            '--tw-prose-quotes': 'rgb(248 250 252)',
            '--tw-prose-quote-borders': 'rgb(55 65 81)',
            '--tw-prose-captions': 'rgb(156 163 175)',
            '--tw-prose-code': 'rgb(248 250 252)',
            '--tw-prose-pre-code': 'rgb(226 232 240)',
            '--tw-prose-pre-bg': 'rgb(30 41 59)',
            '--tw-prose-th-borders': 'rgb(55 65 81)',
            '--tw-prose-td-borders': 'rgb(55 65 81)',
            // Images styling for dark mode
            img: {
              height: '26px',
              width: 'auto',
              display: 'inline-block',
              verticalAlign: 'text-top',
              margin: '0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
