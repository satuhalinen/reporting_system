import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

const MonthlyWorkingHours = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/monthlyworkinghours")
      .then((response) => {
        let transformedData = {};
        for (let i = 0; i < response.data.data.length; i++) {
          let item = response.data.data[i];
          if (!transformedData[item.year]) {
            transformedData[item.year] = { year: item.year, total: 0 };
          }
          transformedData[item.year][item.month] = item.total_hours;
          transformedData[item.year].total += item.total_hours;
        }
        setData(Object.values(transformedData));
      })
      .catch((error) => {
        console.error("Error!", error);
      });
  }, []);

  const columns = [];
  for (let i = 1; i < 12; i++) {
    columns.push({
      title: `${i + 1}`,
      dataIndex: `${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
      key: `${i + 1}`,
    });
  }
  return <Table columns={columns} dataSource={data} />;
};
export default MonthlyWorkingHours;
