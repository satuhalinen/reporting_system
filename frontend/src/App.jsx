import { Breadcrumb, Layout, theme } from "antd";
import Login from "./routes/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Root from "./routes/Root";
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
import DropDownGroup from "./components/DropDownGroup";

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AuthProvider>
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
            <DropDownGroup />
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
              <Routes>
                <Route path="/" element={<Root />}>
                  <Route path="login" element={<Login />} />
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
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
