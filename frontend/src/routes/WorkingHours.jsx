import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { auth } from "../auth/authentication";

const WorkingHours = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getWorkingHours();
  }, []);

  const getWorkingHours = async () => {
    const token = await auth.currentUser.getIdToken();
    axios
      .get("http://localhost:3000/working-hours", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
      });
  };

  const columns = [
    {
      title: "First name",
      dataIndex: "firstname",
      key: "first name",
    },
    {
      title: "Last name",
      dataIndex: "lastname",
      key: "last name",
    },

    {
      title: "Working hours",
      dataIndex: "working hours",
      key: "working hours",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data.map((item, index) => ({
        key: index,
        firstname: item.firstname,
        lastname: item.lastname,
        "working hours": item.hours,
      }))}
    />
  );
};
export default WorkingHours;
