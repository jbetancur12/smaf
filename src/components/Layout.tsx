// import Navbar from "@app/components/Navbar";
// import Sidebar from "@app/components/SideBar";
// import { Box, useMediaQuery } from "@mui/material";
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";

// const Layout: React.FC = () => {
//   const isNonMobile = useMediaQuery("(min-width: 600px)");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
//       <Sidebar user={{ name: "Jorg", occupation: "Engineer" } || {}}
//         isNonMobile={isNonMobile}
//         drawerWidth={250}
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen} />

//       <Box flexGrow={1}>      <Navbar user={{ name: "Jorg", occupation: "Engineer" } || {}}
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen} />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Layout;

import Navbar from "@app/components/Navbar";
import Sidebar from "@app/components/SideBar";
import { useAppSelector } from "@app/hooks/reduxHooks";
import { Box, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = useAppSelector((state) => state.user.user);
  const userNormalized = `${user?.firstName}`;
  const lastName = `${user?.lastName}`;

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={
          { name: userNormalized, occupation: "Usuario", roles: user?.roles } ||
          {}
        }
        isNonMobile={isNonMobile}
        drawerWidth={250}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <Box flexGrow={1}>
        <Navbar
          user={
            {
              name: userNormalized,
              occupation: "Usuario",
              lastName: lastName,
            } || {}
          }
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
