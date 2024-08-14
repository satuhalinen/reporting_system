import { Breadcrumb, Layout, Menu, theme } from "antd";
import Login from "./routes/Login";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Root from "./routes/Root";
import FirstPage from "./routes/FirstPage";
import Home from "./routes/Home";
import Logout from "./components/Logout";
import WorkingHours from "./routes/WorkingHours";
import MonthlyWorkingHours from "./routes/MonthlyWorkingHours";
import CumulativeMonthlyWorkingHours from "./routes/CumulativeMonthlyWorkingHours";
import BillabilityMonthlyWorkingHours from "./routes/BillabilityMonthlyWorkingHours";
import Salary from "./routes/Salary";
import AddUser from "./routes/AddUser";
import UserList from "./routes/UserList";
import ModifyUser from "./routes/ModifyUser";
import ChangePassword from "./routes/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";
import Permissions from "./routes/Permissions";
import { useState } from "react";

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [current, setCurrent] = useState("");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: "Henkilöstö",
      key: "SubMenu1",

      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <NavLink to="/monthly-working-hours">Kaikki tunnit</NavLink>
              ),
              key: "setting:1",
            },
            {
              label: (
                <NavLink to="/cumulative-monthly-working-hours">
                  Kaikki tunnit kumulatiivinen{" "}
                </NavLink>
              ),

              key: "setting:2",
            },
            {
              label: <NavLink to="/salary">Palkkaraportti</NavLink>,
              key: "setting:3",
            },
          ],
        },
      ],
    },
    {
      label: "Tilastot",
      key: "SubMenu2",
      children: [
        {
          type: "group",
          children: [
            {
              label: (
                <NavLink to="/billability-monthly-working-hours">
                  Laskutettavat tunnit
                </NavLink>
              ),
              key: "setting:4",
            },
          ],
        },
      ],
    },
    {
      label: "Käyttöoikeuksien hallinta",
      key: "SubMenu3",
      children: [
        {
          type: "group",
          children: [
            {
              label: <NavLink to="/user-list">Käyttäjälista</NavLink>,
              key: "setting:5",
            },
            {
              label: <NavLink to="/add-user">Käyttäjän lisääminen</NavLink>,
              key: "setting:6",
            },
          ],
        },
      ],
    },
  ];
  return (
    <BrowserRouter>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ flex: 1, minWidth: 0 }}
            onClick={onClick}
            selectedKeys={[current]}
            items={items}
          />
          <NavLink style={{ color: "white" }} to={`/first-page`}>
            Firstpage
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/working-hours`}>
            Working hours
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/login`}>
            Login
          </NavLink>
          <Logout></Logout>
        </Header>
        <Content style={{ padding: "0 48px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item></Breadcrumb.Item>
            <Breadcrumb.Item></Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Root />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="first-page" element={<FirstPage />} />
                  <Route path="working-hours" element={<WorkingHours />} />
                  <Route
                    path="monthly-working-hours"
                    element={<MonthlyWorkingHours />}
                  />

                  <Route
                    path="cumulative-monthly-working-hours"
                    element={<CumulativeMonthlyWorkingHours />}
                  />
                  <Route
                    path="billability-monthly-working-hours"
                    element={<BillabilityMonthlyWorkingHours />}
                  />
                  <Route path="salary" element={<Salary />} />
                  <Route
                    path="add-user"
                    element={<ProtectedRoute adminOnly component={AddUser} />}
                  />
                  <Route
                    path="user-list"
                    element={<ProtectedRoute adminOnly component={UserList} />}
                  />
                  <Route
                    path="modify-user/:id"
                    element={
                      <ProtectedRoute adminOnly component={ModifyUser} />
                    }
                  />
                  <Route
                    path="change-password/:id"
                    element={
                      <ProtectedRoute adminOnly component={ChangePassword} />
                    }
                  />
                  <Route
                    path="permissions/:id"
                    element={
                      <ProtectedRoute adminOnly component={Permissions} />
                    }
                  />
                </Route>
              </Routes>
            </AuthProvider>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
