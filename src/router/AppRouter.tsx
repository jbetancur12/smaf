import Layout from "@app/components/Layout";
import RequireAuth from "@app/components/auth/RequireAuth";
import { withLoading } from "@app/hocs/withLoading";
import { useAppSelector } from "@app/hooks/reduxHooks";
import ForgotPasswordPage from "@app/pages/ForgotPasswordPage";
import LoginPage from "@app/pages/LoginPage";
import NewPasswordPage from "@app/pages/NewPasswordPage";

import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
const Logout = React.lazy(() => import("@app/components/auth/Logout"));

const ROLES = {
  User: "USER_ROLE",
  Admin: "ADMIN_ROLE",
  Viewer: "MODERATOR_ROLE",
};

const LogoutFallback = withLoading(Logout);
const LayoutFallback = withLoading(Layout);

const TemplatesPage = React.lazy(() => import("@app/pages/TemplatesPage"));
const AdminsPage = React.lazy(() => import("@app/pages/AdminsPage/AdminsPage"));
const ControllersPage = React.lazy(
  () => import("@app/pages/ControllersPage/ControllersPage")
);
const ControllerTypesPage = React.lazy(
  () => import("@app/pages/ControllerTypesPage/ControllerTypesPage")
);
const ControllerProgramsPage = React.lazy(
  () => import("@app/pages/ControllerTypesPage/components/Program")
);
const TemplatesDataViewPage = React.lazy(
  () => import("@app/pages/TemplatesPage/DataView2")
);
const CustomersPage = React.lazy(
  () => import("@app/pages/CustomersPage/CustomersPage")
);
const CustomerPage = React.lazy(
  () => import("@app/pages/CustomersPage/CustomerPage/CustomerPage")
);
const CustomerTemplatesPage = React.lazy(
  () =>
    import("@app/pages/CustomersPage/CustomerPage/TemplatesPage/TemplatesPage")
);

const LogsActuactorsPage = React.lazy(
  () => import("@app/pages/LogsActuactorPage")
);

const Templates = withLoading(TemplatesPage);
const Admins = withLoading(AdminsPage);
const Controllers = withLoading(ControllersPage);
const ControllerTypes = withLoading(ControllerTypesPage);
const ControllerPrograms = withLoading(ControllerProgramsPage);
const TemplatesDataView = withLoading(TemplatesDataViewPage);
const Customers = withLoading(CustomersPage);
const Customer = withLoading(CustomerPage);
const CustomerTemplates = withLoading(CustomerTemplatesPage);
const LogsActuactors = withLoading(LogsActuactorsPage);

function AppRouter() {
  // const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const userRole = user ? user.user?.roles : [{ name: "USER_ROLE" }];

  const hasUserRole = userRole?.some(
    (role) => role.name === "USER_ROLE" || role.name === "MODERATOR_ROLE"
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutFallback />}>
          {hasUserRole ? (
            <Route index element={<Navigate to="/templates" replace />} />
          ) : (
            // Puedes agregar una redirección por defecto si el usuario no tiene el rol "USER_ROLE"
            <Route index element={<Navigate to="/customers" replace />} />
          )}
          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.Viewer, ROLES.User, ROLES.Admin]}
              />
            }
          >
            <Route path="/templates">
              <Route index element={<Templates />} />
              <Route path="charts" element={<TemplatesDataView />} />
            </Route>
            <Route path={`/logs-actuactors`} element={<LogsActuactors />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="customers">
              <Route index element={<Customers />} />
              <Route path=":id">
                <Route index element={<Customer />} />
                <Route
                  path="template/:idTemplate"
                  element={<CustomerTemplates />}
                />
                <Route
                  path="controller/:controllerTypeId"
                  element={<ControllerTypes />}
                />
                <Route
                  path="controller-programs/:controllerTypeId"
                  element={<ControllerPrograms />}
                />
              </Route>
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin-users">
              <Route index element={<Admins />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="controllers">
              <Route index element={<Controllers />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="controller-types/:controllerTypeId">
              <Route index element={<ControllerTypes />} />
            </Route>
          </Route>
        </Route>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutFallback />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />
        <Route path="/unauthorized" element={<h1>No tiene Autorización</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

// import Layout from '@app/components/Layout'
// import RequireAuth from '@app/components/auth/RequireAuth'
// import { withLoading } from '@app/hocs/withLoading'
// import { useAppSelector } from '@app/hooks/reduxHooks'
// import LoginPage from '@app/pages/LoginPage'

// import React from 'react'
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// const Logout = React.lazy(() => import('@app/components/auth/Logout'))

// const LogoutFallback = withLoading(Logout)

// const TemplatesPage = React.lazy(() => import('@app/pages/TemplatesPage'))

// const Template = withLoading(TemplatesPage)

// function AppRouter() {

//   const user = useAppSelector((state) => state.user.user)
//   const userRole = user ? user.roles : [{ name: 'USER_ROLE' }]
//   const _roles = userRole.map((rol) => rol.name)

//   const protectedLayout = (
//     <RequireAuth>
//       <Layout />
//     </RequireAuth>
//   )

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path='/' element={protectedLayout}>
//           {_roles.includes('USER_ROLE') ? (
//             <>
//               <Route index element={<Navigate to="/templates" replace />} />
//             </>
//           ) : (
//             <Route index element={<Navigate to="/devices-manager" replace />} />
//           )}
//           <Route path="templates">
//             <Route index element={<Template />} />
//             {/* <Route path="charts" element={<TemplatesDataView />} / */}
//           </Route>
//         </Route>
//         <Route path="/auth/login" element={<LoginPage />} />
//         <Route path="/logout" element={<LogoutFallback />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default AppRouter

// import Layout from '@app/components/Layout';
// import RequireAuth from '@app/components/auth/RequireAuth';
// import { withLoading } from '@app/hocs/withLoading';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import LoginPage from '@app/pages/LoginPage';
// import React from 'react';
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// const Logout = React.lazy(() => import('@app/components/auth/Logout'));
// const TemplatesPage = React.lazy(() => import('@app/pages/TemplatesPage'));
// const LogoutFallback = withLoading(Logoimport Templates from './../pages/TemplatesPage/index';
// ut);import TemplatesPage from './../pages/CustomersPage/CustomerPage/TemplatesPage/TemplatesPage';

// function AppRouter() {
//   const user = useAppSelector((state) => state.user.user);
//   const userRoles = user ? user.roles : [{ name: 'USER_ROLE' }];
//   const roles = userRoles.map((role) => role.name);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<ProtectedLayout roles={roles} />} />
//         <Route path="/auth/login" element={<LoginPage />} />
//         <Route path="/logout" element={<LogoutFallback />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// function ProtectedLayout({ roles }) {
//   return (
//     <RequireAuth>
//       <Layout>{roles.includes('USER_ROLE') ? <UserRoutes /> : <AdminRoutes />}</Layout>
//     </RequireAuth>
//   );
// }

// function UserRoutes() {
//   return (
//     <>
//       <Route index element={<Navigate to="/templates" replace />} />
//       <Route path="templates">
//         <Route index element={<TemplatesPage />} />
//       </Route>
//     </>
//   );
// }

// function AdminRoutes() {
//   return (
//     <Route index element={<Navigate to="/devices-manager" replace />} />
//   );
// }

// export default AppRouter;
