import axios from "axios";
import { Table, Button } from "antd";
import { useState, useEffect } from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState("");

  const fetchEmails = () => {
    axios.get("http://localhost:3000/user-list").then((response) => {
      const emailsNamesWithIds = response.data;
      setUserData(emailsNamesWithIds);
    });
  };

  const deleteUser = () => {
    axios.delete(`http://localhost:3000/user-list/id`).then((response) => {
      const emailsNamesWithIds = response.data;
      setMessage(emailsNamesWithIds);
    });
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
      render: () => (
        <Button onClick={deleteUser} icon={<DeleteOutlined />}>
          Poista
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={userData}></Table>
      <p>{message.message}</p>
    </>
  );
};

export default UserList;
