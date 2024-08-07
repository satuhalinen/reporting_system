import axios from "axios";
import { Table, Button, Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ToolOutlined from "@ant-design/icons/ToolOutlined";
import KeyOutlined from "@ant-design/icons/KeyOutlined";
import { NavLink } from "react-router-dom";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmails = async () => {
    const response = await axios.get("http://localhost:3000/users");
    const emailsNamesWithIds = response.data;
    setUserData(emailsNamesWithIds);
  };

  const deleteUser = async (record) => {
    await axios.delete(`http://localhost:3000/users/${record.id}`);
    await fetchEmails();
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
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchEmails();
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
