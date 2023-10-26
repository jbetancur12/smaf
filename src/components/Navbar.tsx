import {
  ArrowDropDownOutlined,
  Menu as MenuIcon
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  PaletteColor,
  Toolbar,
  Typography,
  useTheme
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

interface User {
  name: string;
  occupation: string;
  lastName: string
}


interface NavbarProps {
  user: User;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({ user, isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  console.log("🚀 ~ file: Navbar.tsx:40 ~ Navbar ~ user:", user)
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          {/* <FlexBetween
          // @ts-ignore
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween> */}
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          {/* <IconButton
            onClick={() => dispatch(setmode())}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton> */}
          {/* <IconButton onClick={() => navigate("/settings")}>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton> */}
          {/* <LanguageSelect /> */}

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              {/* <Box
                component="img"
                alt="profile"
                src="/images/avatar.png"
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover", filter: theme.palette.mode === 'dark' ? 'invert(100%)' : 'none' }}
              /> */}
              <Box textAlign="center"
  display="flex"
  justifyContent="center"
  alignItems="center" sx={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: theme.palette.secondary["100" as keyof PaletteColor] }}>
                <Typography
                  fontWeight="bold"
                  fontSize="1rem"
                  //@ts-ignore
                  sx={{ color: theme.palette.neutral["1000" as keyof PaletteColor] }}
                >
                  {user.name.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary["300" as keyof PaletteColor], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem><Link to="/logout">Log out</Link></MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
