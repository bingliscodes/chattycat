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
            value: { base: '#FFFEFC', _dark: '#1A1D21' },
          },
          primaryBtn: {
            value: { base: '#59295A', _dark: '#201024' },
          },
          secondaryBtn: {
            value: {
              base: 'colors.white',
              _dark: 'colors.white',
            },
          },
          secondaryBtnHover: {
            value: {
              base: 'colors.gray.400',
              _dark: 'colors.gray.400',
            },
          },
          form: {
            value: { base: '{#80A1BA/90}', _dark: '{#3B1C32/90}' },
          },
          navHover: {
            value: { base: '{#59295A/60}', _dark: '{#A64D79/40}' },
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
          sidebar: {
            value: { base: '#d6b3b8', _dark: '{#670D2F/50}' },
          },
          itemHover: {
            value: { base: '{colors.gray.500/60}', _dark: 'colors.gray.700' },
          },
          selectedItem: {
            value: { base: '#F9EDFF', _dark: '{colors.gray.300/90}' },
          },
          chatBox: {
            value: { base: 'colors.gray.100', _dark: '{colors.gray.800/40}' },
          },
        },
        text: {
          DEFAULT: {
            value: { base: 'colors.black', _dark: 'colors.white' },
          },
          primaryBtn: {
            value: { base: '#FFFEFC', _dark: '#FFFEFC' },
          },
          secondaryBtn: {
            value: {
              base: '#1A1A1D',
              _dark: '#1A1A1D',
            },
          },
          logo: {
            value: { base: '#1A1A1D', _dark: 'colors.gray.200' },
          },
          formHeader: {
            value: { base: '#DCC9E1', _dark: 'colors.gray.400' },
          },
          sidebar: {
            value: { base: '#DCC9E1', _dark: 'colors.gray.400' },
          },
          selectedItem: {
            value: {
              base: '#7B557D',
              _dark: 'colors.gray.900',
            },
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
      gradients: {
        sidebar: {
          value: {
            base: 'linear-gradient(to right, #572759, #59295A)',
            _dark: 'linear-gradient(to right, #1B0F1E, #201024)',
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
    },
  },
});
export default system;
