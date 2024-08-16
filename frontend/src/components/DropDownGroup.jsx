import { Menu, Button } from "antd";
import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import Logout from "../components/Logout";
import "./DropDownGroupStyling.css";

const DropDownGroup = () => {
  const [current, setCurrent] = useState("");
  const { user, loading } = useContext(AuthContext);
  const [links, setLinks] = useState();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const userCheckHours = () => {
    if (!user) {
      return null;
    } else {
      try {
        const parsedClaims = JSON.parse(
          user.proactiveRefresh.user.reloadUserInfo.customAttributes
        );
        const parsedPalkka = parsedClaims["Kaikki tunnit"];
        return parsedPalkka;
      } catch (error) {
        return null;
      }
    }
  };
  const userCheckCumulativeHours = () => {
    if (!user) {
      return null;
    } else {
      try {
        const parsedClaims = JSON.parse(
          user.proactiveRefresh.user.reloadUserInfo.customAttributes
        );
        const parsedPalkka = parsedClaims["Kaikki tunnit kumulatiivinen"];
        return parsedPalkka;
      } catch (error) {
        return null;
      }
    }
  };
  const userCheckSalary = () => {
    if (!user) {
      return null;
    } else {
      try {
        const parsedClaims = JSON.parse(
          user.proactiveRefresh.user.reloadUserInfo.customAttributes
        );
        const parsedPalkka = parsedClaims["Palkka"];
        return parsedPalkka;
      } catch (error) {
        return null;
      }
    }
  };
  const userCheckBillability = () => {
    if (!user) {
      return null;
    } else {
      try {
        const parsedClaims = JSON.parse(
          user.proactiveRefresh.user.reloadUserInfo.customAttributes
        );
        const parsedPalkka = parsedClaims["Laskutettavat tunnit"];
        return parsedPalkka;
      } catch (error) {
        return null;
      }
    }
  };

  const userCheckAdmin = () => {
    if (!user) {
      return null;
    } else {
      try {
        const parsedClaims = JSON.parse(
          user.proactiveRefresh.user.reloadUserInfo.customAttributes
        );
        const parsedAdmin = parsedClaims["admin"];
        return parsedAdmin;
      } catch (error) {
        return null;
      }
    }
    //
  };

  const items = [];
  const itemsConstructor = () => {
    if (userCheckHours() || userCheckCumulativeHours() || userCheckSalary()) {
      items.push({
        label: "Henkilöstö",
        key: "SubMenu1",
        children: [],
      });
    } else {
      items.push({});
    }
    if (userCheckHours()) {
      items[0].children.push({
        label: <NavLink to="/monthly-working-hours">Kaikki tunnit</NavLink>,
        key: "setting:1",
      });
      if (userCheckCumulativeHours()) {
        items[0].children.push({
          label: (
            <NavLink to="/cumulative-monthly-working-hours">
              Kaikki tunnit kumulatiivinen{" "}
            </NavLink>
          ),
          key: "setting:2",
        });
      }
      if (userCheckSalary()) {
        items[0].children.push({
          label: <NavLink to="/salary">Palkkaraportti</NavLink>,
          key: "setting:3",
        });
      }
    }
    if (userCheckBillability()) {
      items.push({
        label: "Tilastot",
        key: "SubMenu2",
        children: [],
      });
      items[1].children.push({
        label: (
          <NavLink to="/billability-monthly-working-hours">
            Laskutettavat tunnit
          </NavLink>
        ),
        key: "setting:4",
      });
    } else {
      items.push({});
    }

    if (userCheckAdmin()) {
      items.push({
        label: "Käyttöoikeuksien hallinta",
        key: "SubMenu3",
        children: [],
      });
      items[2].children.push({
        label: <NavLink to="/user-list">Käyttäjälista</NavLink>,
        key: "setting:5",
      });
      items[2].children.push({
        label: <NavLink to="/add-user">Käyttäjän lisääminen</NavLink>,
        key: "setting:6",
      });
    } else {
      items.push({});
    }

    items.push({
      label: "Käyttäjä",
      key: "SubMenu4",
      className: "user",
      children: [],
    });

    if (user) {
      items[3].children.push({
        label: <Logout></Logout>,
        key: "setting:7",
      });
    } else {
      items[3].children.push({
        label: (
          <NavLink to="/login">
            <Button style={{ color: "black" }}>Kirjautuminen</Button>
          </NavLink>
        ),
        key: "setting:7",
      });
    }

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
      style={{ flex: 1 }}
      onClick={onClick}
      selectedKeys={[current]}
      items={links}
    />
  );
};

export default DropDownGroup;
