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

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
            defaultSelectedKeys={["2"]}
            style={{ flex: 1, minWidth: 0 }}
          />
          <NavLink style={{ color: "white" }} to={`/user-list`}>
            User list
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/add-user`}>
            Add user
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/salary`}>
            Salary
          </NavLink>
          <NavLink
            style={{ color: "white" }}
            to={`/cumulative-monthly-working-hours`}
          >
            Cumulative monthly working hours
          </NavLink>
          <NavLink
            style={{ color: "white" }}
            to={`/billability-monthly-working-hours`}
          >
            Billability monthly working hours
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/working-hours`}>
            Working hours
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/monthly-working-hours`}>
            Monthly working hours
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/first-page`}>
            Firstpage
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
                <Route path="add-user" element={<AddUser />} />
                <Route path="user-list" element={<UserList />} />
                <Route path="modify-user/:id" element={<ModifyUser />} />
              </Route>
            </Routes>
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
