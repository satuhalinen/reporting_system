import axios from "axios";
import { Table } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const UserList = () => {
  const [userData, setUserData] = useState([]);

  const fetchEmails = () => {
    axios.get("http://localhost:3000/user-list").then((response) => {
      const emailsWithIds = response.data.emails;
      const namesWithIds = response.data.names;
      const transformedUsers = namesWithIds.map((user) => ({
        id: user.id,
        firstname: user.data.firstname,
        lastname: user.data.lastname,
      }));

      const emailsNamesWithIds = [];

      for (let i = 0; i < transformedUsers.length; i++) {
        const name = transformedUsers[i];
        let emailObj = null;
        for (let j = 0; j < emailsWithIds.length; j++) {
          if (emailsWithIds[j].uid === name.id) {
            emailObj = emailsWithIds[j];
            break;
          }
        }

        const newEmailsNamesWithIds = {
          ...name,
          email: emailObj ? emailObj.email : null,
        };

        emailsNamesWithIds.push(newEmailsNamesWithIds);
      }

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

  return (
    <>
      <Table columns={columns} dataSource={userData}></Table>
    </>
  );
};

export default UserList;
