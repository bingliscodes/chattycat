import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { base: 'colors.gray.100', _dark: 'colors.blue.300' },
          },
          nav: {
            value: { base: 'colors.gray.100', _dark: 'colors.gray.900' },
          },
          primaryBtn: {
            value: { base: 'colors.blue.200', _dark: 'colors.blue.900' },
          },
          navHover: {
            value: { base: 'colors.white', _dark: 'colors.gray.700' },
          },
          stack: {
            value: { base: 'colors.white', _dark: 'colors.gray.900' },
          },
          badge: {
            value: { base: 'colors.gray.50', _dark: 'colors.gray.800' },
          },
          menu: {
            value: { base: 'colors.gray.200', _dark: 'colors.gray.900' },
          },
          menuItem: {
            value: { base: 'colors.blue.100', _dark: 'colors.gray.900' },
          },
          sideBar: {
            value: { base: '#d6b3b8', _dark: 'colors.pink.950' },
          },
          form: {
            value: { base: 'colors.gray.400', _dark: '{colors.pink.950/80}' },
          },
        },
        text: {
          DEFAULT: {
            value: { base: 'colors.black', _dark: 'colors.white' },
          },
          primaryBtn: {
            value: { base: 'colors.gray.600', _dark: 'colors.blue.300' },
          },
        },

        border: {
          DEFAULT: {
            value: { base: 'colors.gray.200', _dark: 'colors.gray.700' },
          },
        },
      },
      sizes: {
        width: {
          DEFAULT: {
            value: {
              base: '20rem',
              sm: '30rem',
              md: '48rem',
              lg: '62rem',
              xl: '80rem',
              '2xl': '96rem',
            },
          },
          form: {
            value: {
              base: '20rem',
              sm: '30rem',
              md: '48rem',
              lg: '48rem',
              xl: '48rem',
              '2xl': '48rem',
            },
          },
        },
      },
    },
    tokens: {
      colors: {
        primary: { value: 'black' },
        secondary: { value: 'colors.gray.100' },
      },
      // (you can also define other token groups: spacing, sizes, etc.)
    },
  },
});
export default system;
