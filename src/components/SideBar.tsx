import {
  AdminPanelSettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  DeviceThermostatOutlined,
  FactoryOutlined
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  PaletteColor,
  Typography,
  useTheme
} from "@mui/material";
import logo from "assets/smaf_logo-nobg.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = () => [
  {
    text: "Plantillas",
    icon: <DeviceThermostatOutlined />,
    path: "templates",
    visibleToRoles: ["USER_ROLE"]
  },
  {
    text: "Clientes",
    icon: <FactoryOutlined />,
    path: "customers",
    visibleToRoles: ["ADMIN_ROLE"]
  },
  {
    text: "Usuarios",
    icon: <AdminPanelSettingsOutlined />,
    path: "admin-users",
    visibleToRoles: ["ADMIN_ROLE"]
  },
  // ...otros elementos del menú
];


interface SidebarProps {
  user: {
    name: string;
    occupation: string;
    roles?: [
      {
        name: string
        _id?: string
        createdAt?: Date
      }
    ]
  };
  drawerWidth: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNonMobile: boolean;
}


const Sidebar:React.FC<SidebarProps> = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile, // Agrega la variable de tema aquí
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme()

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const userRoles = user.roles && Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];
     return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary["200" as keyof PaletteColor],
              // @ts-ignore
              backgroundColor: theme.palette.secondary["100" as keyof PaletteColor],
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.primary.main}>
                <Box display="flex" alignContent="center" justifyContent="center" gap="0.5rem" >
                  {/* <Typography variant="h4" fontWeight="bold">
                    ECOMVISION
                  </Typography> */}

                  <Box
                    component="img"
                    alt="logo"
                    src={logo}
                    height="70px"
                    width="70px"

                    // borderRadius="50%"
                    // sx={{ objectFit: "cover"}}
                  />
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems()
              //@ts-ignore
               .filter((item) => item.visibleToRoles.some((role) => userRoles.includes(role)))
              .map(({ text, icon, path }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${path}`);
                        setActive(path);
                      }}
                      sx={{
                        backgroundColor:
                          active === path
                            ? theme.palette.secondary["50" as keyof PaletteColor]
                            : "transparent",
                        color:
                          active === path
                            ? theme.palette.primary["900" as keyof PaletteColor]
                            : theme.palette.secondary["900" as keyof PaletteColor],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === path
                              ? theme.palette.primary["900" as keyof PaletteColor]
                              : theme.palette.secondary["900" as keyof PaletteColor],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === path && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover", filter: theme.palette.mode === 'dark' ? 'invert(100%)' : 'none' }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary["100" as keyof PaletteColor] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary["200" as keyof PaletteColor] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{
                  color: theme.palette.secondary["300" as keyof PaletteColor],
                  fontSize: "25px ",
                }}
              />
            </FlexBetween>
          </Box> */}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
