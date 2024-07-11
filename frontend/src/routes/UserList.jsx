import axios from "axios";
import { Table } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmails = () => {
    axios.get("http://localhost:3000/user-list").then((response) => {
      const firstnames = response.data.users.map((person) => person.firstname);
      const lastnames = response.data.users.map((person) => person.lastname);
      const emails = response.data.emails;

      const information = lastnames.map((lastname, index) => ({
        lastname: lastname,
        firstname: firstnames[index],
        email: emails[index],
      }));
      setUserData(information);
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

  return (
    <>
      <Table columns={columns} dataSource={userData}></Table>
    </>
  );
};

export default UserList;
