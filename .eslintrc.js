module.exports = {
  extends: require.resolve('umi/eslint'),
  rules: {
    'no-console': 1,
    'react/no-unknown-property': [
      'error',
      {
        ignore: [
          'args',
          'intensity',
          'position',
          'rotation',
          'scale',
          'attach',
          'wireframe',
          'side',
          'dashSize',
          'gapSize',
          'transparent',
          'map',
          'aoMap',
          'geometry',
          'alphaMap',
        ],
      },
    ],
  },
};
