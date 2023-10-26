// Importa las librerías necesarias

const rootElement = document.getElementById('root');


interface CustomBackground {
  default: string;
  alt: string;
}

export interface CustomPalette {
  background: CustomBackground;
  // Otras propiedades de color personalizadas aquí
}
// Define los tipos para los tokens
interface Token {
  [key: string]: string;
}

interface Tokens {
  grey: Token;
  primary: Token;
  secondary: Token;
  [key: string]: Token;
}



// Define los tokens oscuros
export const tokensLight: Tokens = {
  grey: {
    0: "#ffffff",
    10: "#f6f6f6",
    50: "#a4bdc8", // Gris representativo de tu marca
    100: "#788c96", // Otro tono de gris de tu marca
    200: "#5f7078", // Otro tono de gris de tu marca
    300: "#c2c2c2",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  primary: {
    100: "#c8e8bf", // Color primario más claro basado en tu color representativo
    200: "#34A13D", // Color principal de tu marca
    300: "#1c7f2d", // Color primario ligeramente más oscuro
    400: "#1a7329", // Color primario aún más oscuro
    500: "#165e23", // Color primario aún más oscuro
    600: "#134f1c", // Color primario aún más oscuro
    700: "#0e3c14", // Color primario aún más oscuro
    800: "#0a2b0e", // Color primario aún más oscuro
    900: "#061906", // Color primario aún más oscuro
  },
  secondary: {
    50: "#a8dbe7", // Color secundario más claro basado en tu color complementario
    100: "#70C0D4", // Color complementario de tu marca
    200: "#66aecb", // Color secundario ligeramente más oscuro
    300: "#5992b7", // Color secundario aún más oscuro
    400: "#4e81a7", // Color secundario aún más oscuro
    500: "#426d95", // Color secundario aún más oscuro
    600: "#3a5e86", // Color secundario aún más oscuro
    700: "#314c75", // Color secundario aún más oscuro
    800: "#273b63", // Color secundario aún más oscuro
    900: "#1f2b54", // Color secundario aún más oscuro
  },
};




// Define una función para revertir los tokens
function reverseTokens(tokens: Tokens): Tokens {
  const reversedTokens: Tokens = {
    grey: {},
    primary: {},
    secondary: {},
  };

  for (const [key, value] of Object.entries(tokens)) {
    const reversedObj: Token = {};
    const keys: string[] = Object.keys(value);
    const values: string[] = Object.values(value);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  }

  return reversedTokens;
}

// Define los tokens claros a partir de los oscuros
export const tokensDark: Tokens = reverseTokens(tokensLight);

// Define la función de configuración del tema
export const themeSettings = (mode: "dark" | "light") => {
  console.log("🚀 ~ file: theme.ts:102 ~ themeSettings ~ mode:", mode)
  return {
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiDialog: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // valores de la paleta para el modo oscuro
            primary: {
              ...tokensDark.primary  as { [key: string]: string },
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary  as { [key: string]: string },
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey  as { [key: string]: string },
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // valores de la paleta para el modo claro
            primary: {
              ...tokensLight.primary  as { [key: string]: string },
              main: tokensLight.grey[50],
              light: tokensLight.grey[100],
            },
            secondary: {
              ...tokensLight.secondary  as { [key: string]: string },
              main: tokensLight.secondary[600],
              light: tokensLight.secondary[700],
            },
            neutral: {
              ...tokensLight.grey  as { [key: string]: string },
              main: tokensLight.grey[500],
            },
            background: {
              default: tokensLight.grey[0],
              alt: tokensLight.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
