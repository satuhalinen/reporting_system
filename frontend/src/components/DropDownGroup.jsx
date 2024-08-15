import { Menu } from "antd";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Logout from "../components/Logout";

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
      const parsedClaims = JSON.parse(
        user.proactiveRefresh.user.reloadUserInfo.customAttributes
      );
      const parsedKaikkiTunnit = parsedClaims["Kaikki tunnit"];
      return parsedKaikkiTunnit;
    }
  };
  const userCheckCumulativeHours = () => {
    if (!user) {
      return null;
    } else {
      const parsedClaims = JSON.parse(
        user.proactiveRefresh.user.reloadUserInfo.customAttributes
      );
      const parsedKaikkiTunnit = parsedClaims["Kaikki tunnit kumulatiivinen"];
      return parsedKaikkiTunnit;
    }
  };
  const userCheckSalary = () => {
    if (!user) {
      return null;
    } else {
      const parsedClaims = JSON.parse(
        user.proactiveRefresh.user.reloadUserInfo.customAttributes
      );
      const parsedPalkka = parsedClaims["Palkka"];
      return parsedPalkka;
    }
  };
  const userCheckBillability = () => {
    if (!user) {
      return null;
    } else {
      const parsedClaims = JSON.parse(
        user.proactiveRefresh.user.reloadUserInfo.customAttributes
      );
      const parsedPalkka = parsedClaims["Laskutettavat tunnit"];
      return parsedPalkka;
    }
  };

  const userCheckAdmin = () => {
    if (!user) {
      return null;
    } else {
      const parsedClaims = JSON.parse(
        user.proactiveRefresh.user.reloadUserInfo.customAttributes
      );
      const parsedAdmin = parsedClaims["admin"];
      return parsedAdmin;
    }
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
      children: [],
    });

    if (user) {
      items[3].children.push({
        label: <Logout></Logout>,
        key: "setting:7",
      });
    } else {
      items[3].children.push({
        label: <NavLink to="/login">Kirjautuminen</NavLink>,
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
      style={{ flex: 1, minWidth: 0 }}
      onClick={onClick}
      selectedKeys={[current]}
      items={links}
    />
  );
};

export default DropDownGroup;
