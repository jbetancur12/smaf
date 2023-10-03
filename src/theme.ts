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
export const tokensDark: Tokens = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // blue
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#a4edc6",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
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
export const tokensLight: Tokens = reverseTokens(tokensDark);

// Define la función de configuración del tema
export const themeSettings = (mode: "dark" | "light") => {
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
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary  as { [key: string]: string },
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey  as { [key: string]: string },
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
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
