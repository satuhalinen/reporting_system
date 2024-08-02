import axios from "axios";
import { Table } from "antd";
import { useState, useEffect } from "react";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmails = () => {
    axios.get("http://localhost:3000/user-list").then((response) => {
      const emailsNamesWithIds = response.data;
      setUserData(emailsNamesWithIds);
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
  ];

  useEffect(() => {
    fetchEmails();
  }, []);

  return <Table columns={columns} dataSource={userData}></Table>;
};

export default UserList;
