import { Box, PaletteColor, Typography, useTheme } from "@mui/material";

interface HeaderProps {
  title?: string;
  subtitle?: string
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.primary["200" as keyof PaletteColor]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={theme.palette.primary["300" as keyof PaletteColor]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
