module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@types': './src/types',
            '@app-types': './src/types',
            '@assets': './src/assets',
            '@config': './src/config',
            '@theme': './src/theme',
            '@contexts': './src/contexts',
            '@store': './src/store',
            '@dev-tools': './src/dev-tools',
            '@data': './src/data',
            '@designSystem': './src/DesignSystem',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
