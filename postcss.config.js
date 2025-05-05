module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: { 
        'custom-properties': false,
        'nesting-rules': true
      },
      stage: 3
    }
  }
}