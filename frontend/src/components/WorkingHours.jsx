import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

const WorkingHours = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error!", error);
      });
  }, []);

  const columns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
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
      dataSource={data.map((item) => ({
        key: item.id,
        employee: item.employee_id,
        "working hours": item.hours,
      }))}
    />
  );
};
export default WorkingHours;
