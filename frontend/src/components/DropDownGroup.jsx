import { Menu } from "antd";
import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import Logout from "../components/Logout";

const DropDownGroup = () => {
  const [current, setCurrent] = useState("");
  const { user, loading } = useContext(AuthContext);
  const [links, setLinks] = useState();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const itemsConstructor = () => {
    const items = [];
    const userMenu = { label: "Käyttäjä", key: "SubMenu4", children: [] };
    if (user) {
      let parsedClaims = {};
      try {
        const customAttributes =
          user.proactiveRefresh.user.reloadUserInfo.customAttributes;
        if (customAttributes) {
          parsedClaims = JSON.parse(customAttributes);
        }
      } catch (error) {
        console.error("Error parsing claims", error);
      }

      const parsedMonthlyHours = parsedClaims["Kaikki tunnit"];
      const parsedCumulativeMonthlyHours =
        parsedClaims["Kaikki tunnit kumulatiivinen"];
      const parsedSalary = parsedClaims["Palkka"];
      const parsedBillability = parsedClaims["Laskutettavat tunnit"];
      const parsedAdmin = parsedClaims["admin"];

      const staff = {
        label: "Henkilöstö",
        key: "SubMenu1",
        children: [],
      };
      if (parsedMonthlyHours) {
        staff.children.push({
          label: <NavLink to="/monthly-working-hours">Kaikki tunnit</NavLink>,
          key: "setting:1",
        });
      }
      if (parsedCumulativeMonthlyHours) {
        staff.children.push({
          label: (
            <NavLink to="/cumulative-monthly-working-hours">
              Kaikki tunnit kumulatiivinen{" "}
            </NavLink>
          ),
          key: "setting:2",
        });
      }

      if (parsedSalary) {
        staff.children.push({
          label: <NavLink to="/salary">Palkkaraportti</NavLink>,
          key: "setting:3",
        });
      }

      if (parsedMonthlyHours || parsedCumulativeMonthlyHours || parsedSalary) {
        items.push(staff);
      }

      const statistics = {
        label: "Tilastot",
        key: "SubMenu2",
        children: [],
      };

      if (parsedBillability) {
        statistics.children.push({
          label: (
            <NavLink to="/billability-monthly-working-hours">
              Laskutettavat tunnit
            </NavLink>
          ),
          key: "setting:4",
        });
        items.push(statistics);
      }

      const userRights = {
        label: "Käyttöoikeuksien hallinta",
        key: "SubMenu3",
        children: [],
      };

      if (parsedAdmin) {
        userRights.children.push({
          label: <NavLink to="/user-list">Käyttäjälista</NavLink>,
          key: "setting:5",
        });
        userRights.children.push({
          label: <NavLink to="/add-user">Käyttäjän lisääminen</NavLink>,
          key: "setting:6",
        });
        items.push(userRights);
      }

      userMenu.children.push({
        label: <Logout></Logout>,
        key: "setting:7",
      });
    } else {
      userMenu.children.push({
        label: <NavLink to="/login">Kirjautuminen</NavLink>,
        key: "setting:7",
      });
    }
    items.push(userMenu);
    setLinks(items);
  };

  useEffect(() => {
    itemsConstructor();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      style={{ flex: 1, minWidth: 0 }}
      onClick={onClick}
      selectedKeys={[current]}
      items={links}
    />
  );
};

export default DropDownGroup;
