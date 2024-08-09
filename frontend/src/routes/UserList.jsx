import axios from "axios";
import { Table, Button, Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ToolOutlined from "@ant-design/icons/ToolOutlined";
import KeyOutlined from "@ant-design/icons/KeyOutlined";
import { NavLink } from "react-router-dom";
import { auth } from "../auth/authentication";
import { HddOutlined } from "@ant-design/icons";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmailsNamesIds = async () => {
    const token = await auth.currentUser.getIdToken();
    const response = await axios.get("http://localhost:3000/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const emailsNamesWithIds = response.data;
    setUserData(emailsNamesWithIds);
  };

  const deleteUser = async (record) => {
    const token = await auth.currentUser.getIdToken();
    await axios.delete(`http://localhost:3000/users/${record.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchEmailsNamesIds();
  };

  const columns = [
    {
      title: "Käyttäjätunnus",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Sukunimi",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Etunimi",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Toimenpiteet",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Popconfirm
            title="Haluatko varmasti poistaa käyttäjän?"
            okText="Kyllä"
            cancelText="En"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
          >
            <Button icon={<DeleteOutlined />}>Poista käyttäjä</Button>
          </Popconfirm>
          <NavLink style={{ color: "white" }} to={`/modify-user/${record.id}`}>
            <Button icon={<ToolOutlined />}>Muokkaa käyttäjän tietoja</Button>
          </NavLink>
          <NavLink
            style={{ color: "white" }}
            to={`/change-password/${record.id}`}
          >
            <Button icon={<KeyOutlined />}>Vaihda salasana</Button>
          </NavLink>
          <NavLink style={{ color: "white" }} to={`/permissions/${record.id}`}>
            <Button icon={<HddOutlined />}>Hallitse käyttöoikeuksia</Button>
          </NavLink>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchEmailsNamesIds();
  }, []);

  const confirm = async (user) => {
    await deleteUser(user);
    message.success("Käyttäjä on poistettu.");
  };

  const cancel = () => {
    message.error("Käyttäjää ei poistettu.");
  };

  return <Table columns={columns} dataSource={userData} rowKey="id"></Table>;
};

export default UserList;
