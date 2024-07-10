import axios from "axios";
import { Table } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const UserList = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = () => {
    axios.get("http://localhost:3000/user-list").then((response) => {
      const emailsWithKeys = response.data.map((email, index) => ({
        key: index + 1,
        email: email,
      }));
      setEmails(emailsWithKeys);
    });
  };

  const columns = [
    {
      title: "Käyttäjätunnus",
      dataIndex: "email",
      key: "email",
    },
  ];

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={emails}></Table>
    </>
  );
};

export default UserList;
