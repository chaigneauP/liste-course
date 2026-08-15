// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

const frameworkPaths = [
  { name: 'react', message: 'This layer must stay framework-free.' },
  { name: 'react-dom', message: 'This layer must stay framework-free.' },
  { name: 'react-native', message: 'This layer must stay framework-free.' },
  {
    name: '@react-native-async-storage/async-storage',
    message: 'AsyncStorage belongs in infrastructure only.',
  },
];

const frameworkPatterns = [
  {
    group: ['expo', 'expo-*', '@expo/*'],
    message: 'This layer must stay framework-free.',
  },
];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    // React Compiler plugin rules conflict with common RN patterns
    // (Animated.Value via useRef, Reanimated shared values, modal reset in effects).
    // Architecture boundaries below remain the hard gates for this project.
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  {
    files: ['src/domain/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: frameworkPaths,
          patterns: [
            ...frameworkPatterns,
            {
              group: ['@/application', '@/application/*'],
              message: 'Domain cannot import application.',
            },
            {
              group: ['@/infrastructure', '@/infrastructure/*'],
              message: 'Domain cannot import infrastructure.',
            },
            {
              group: ['@/presentation', '@/presentation/*'],
              message: 'Domain cannot import presentation.',
            },
            {
              group: ['@/app', '@/app/*'],
              message: 'Domain cannot import app routes.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/application/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: frameworkPaths,
          patterns: [
            ...frameworkPatterns,
            {
              group: ['@/infrastructure', '@/infrastructure/*'],
              message: 'Application cannot import infrastructure.',
            },
            {
              group: ['@/presentation', '@/presentation/*'],
              message: 'Application cannot import presentation.',
            },
            {
              group: ['@/app', '@/app/*'],
              message: 'Application cannot import app routes.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/presentation/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@react-native-async-storage/async-storage',
              message: 'Presentation must not import AsyncStorage; use use cases.',
            },
          ],
          patterns: [
            {
              group: ['@/infrastructure', '@/infrastructure/*'],
              message: 'Presentation cannot import infrastructure.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/infrastructure/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/presentation', '@/presentation/*'],
              message: 'Infrastructure cannot import presentation.',
            },
            {
              group: ['@/app', '@/app/*'],
              message: 'Infrastructure cannot import app routes.',
            },
          ],
        },
      ],
    },
  },
  // Last: turn off ESLint rules that conflict with Prettier formatting.
  eslintConfigPrettier,
]);
