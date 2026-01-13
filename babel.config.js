module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/features': './src/features',
            '@/shared': './src/shared',
            '@/components': './src/shared/components',
            '@/primitives': './src/shared/components/primitives',
            '@/layouts': './src/shared/components/layouts',
            '@/patterns': './src/shared/components/patterns',
            '@/hooks': './src/shared/hooks',
            '@/lib': './src/shared/lib',
            '@/styles': './src/shared/styles',
            '@/types': './src/shared/types',
            '@/config': './src/config',
            '@/providers': './src/providers',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
