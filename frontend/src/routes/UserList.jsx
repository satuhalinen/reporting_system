import axios from "axios";
import { Table, Button } from "antd";
import { useState, useEffect } from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmails = () => {
    axios.get("http://localhost:3000/user-list").then((response) => {
      const emailsNamesWithIds = response.data;
      setUserData(emailsNamesWithIds);
    });
  };

  const deleteUser = (record) => {
    axios.delete(`http://localhost:3000/user-list/${record.id}`);
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
        <Button onClick={() => deleteUser(record)} icon={<DeleteOutlined />}>
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
      <Table columns={columns} dataSource={userData} rowKey="email"></Table>
    </>
  );
};

export default UserList;
