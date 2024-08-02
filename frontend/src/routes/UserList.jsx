import axios from "axios";
import { Table, Button, Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmails = async () => {
    const response = await axios.get("http://localhost:3000/user-list");
    const emailsNamesWithIds = response.data;
    setUserData(emailsNamesWithIds);
  };

  const deleteUser = async (record) => {
    await axios.delete(`http://localhost:3000/user-list/${record.id}`);
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
        <Popconfirm
          title="Haluatko varmasti poistaa käyttäjän?"
          okText="Kyllä"
          cancelText="En"
          onConfirm={() => confirm(record)}
          onCancel={cancel}
        >
          <Button icon={<DeleteOutlined />}>Poista</Button>
        </Popconfirm>
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
