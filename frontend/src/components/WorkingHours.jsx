import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

const WorkingHours = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/workinghours")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error!", error);
      });
  }, []);

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
