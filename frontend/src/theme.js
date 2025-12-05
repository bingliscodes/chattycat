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
            value: { base: '#80A1BA', _dark: '#13151b' },
          },
          primaryBtn: {
            value: { base: '#91C4C3', _dark: '{#A64D79/90}' },
          },
          navHover: {
            value: { base: '{#91C4C3/60}', _dark: '{#A64D79/60}' },
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
            value: { base: '#d6b3b8', _dark: '{#670D2F/50}' },
          },
          form: {
            value: { base: '{#80A1BA/90}', _dark: '{#3B1C32/90}' },
          },
          itemHover: {
            value: { base: '{#91C4C3/40}', _dark: 'colors.gray.700' },
          },
          selectedItem: {
            value: { base: '{#91C4C3/90}', _dark: '{colors.gray.900/90}' },
          },
          chatBox: {
            value: { base: '{#FFF7DD/40}', _dark: '{colors.gray.900/80}' },
          },
        },
        text: {
          DEFAULT: {
            value: { base: 'colors.black', _dark: 'colors.white' },
          },
          primaryBtn: {
            value: { base: '#FFF7DD', _dark: '#1A1A1D' },
          },
          logo: {
            value: { base: '#FFF7DD', _dark: '#A64D79' },
          },
          formHeader: {
            value: { base: '#FFF7DD', _dark: 'colors.gray.300' },
          },
          sidebarHeader: {
            value: { base: 'colors.gray.600', _dark: 'colors.gray.400' },
          },
        },

        borders: {
          DEFAULT: {
            value: { base: 'colors.black', _dark: 'colors.gray.400' },
          },
          signupInput: {
            value: { base: 'colors.gray.900', _dark: 'colors.gray.200' },
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
