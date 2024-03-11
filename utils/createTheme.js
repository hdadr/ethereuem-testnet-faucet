import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    opaqueBg: "rgba(25,25,25,0.94)",
    primary: {
      main: "#b8afec",
    },
    secondary: {
      main: "#f3b3ac",
    },
    contrastThreshold: 4,
    tonalOffset: 0.2,
  },
});
