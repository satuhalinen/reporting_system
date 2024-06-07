import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Col, Row } from "antd";
import SideBar from "../components/SideBar";

const MonthlyWorkingHours = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);

  const onYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const applyFilters = () => {
    console.log(selectedYear);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/monthly-working-hours")
      .then((response) => {
        const transformedData = {};
        for (let i = 0; i < response.data.data.length; i++) {
          const item = response.data.data[i];

          if (!transformedData[item.year]) {
            transformedData[item.year] = { year: item.year, total: 0 };
          }
          transformedData[item.year][item.month] = item.total_hours;
          transformedData[item.year].total += item.total_hours;
        }
        setData(Object.values(transformedData));
      });
  }, []);

  const columns = [];
  columns.push({ title: "Vuosi", dataIndex: "year", key: "year" });
  for (let i = 1; i < 13; i++) {
    columns.push({
      title: i,
      dataIndex: i < 10 ? `0${i}` : i,
      key: i,
    });
  }
  columns.push({
    title: "Yhteensä",
    dataIndex: "total",
    key: "total",
  });

  return (
    <Row>
      <Col span={19} push={5}>
        <Table columns={columns} dataSource={data} />{" "}
      </Col>
      <Col span={5} pull={19}>
        Ajanjakso
        <SideBar
          onYearChange={onYearChange}
          selectedYear={selectedYear}
          applyFilters={applyFilters}
        />
      </Col>
    </Row>
  );
};
export default MonthlyWorkingHours;
