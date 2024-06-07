import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Col, Row } from "antd";
import SideBar from "../components/SideBar";

const MonthlyWorkingHours = () => {
  const [data, setData] = useState([]);
  const [firstYear, setFirstYear] = useState(2024);

  const drawTable = (e) => {
    setFirstYear(e.target.value);
  };

  const printYear = () => {
    console.log(firstYear);
  };
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
  columns.push({ title: "Vuosi", dataIndex: "year", key: "year" });
  for (let i = 0; i < 12; i++) {
    columns.push({
      title: `${i + 1}`,
      dataIndex: `${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
      key: `${i + 1}`,
    });
  }
  columns.push({
    title: "Yhteensä",
    dataIndex: "total",
    key: "total",
  });

  return (
    <>
      <Row>
        <Col span={19} push={5}>
          <Table columns={columns} dataSource={data} />{" "}
        </Col>
        <Col span={5} pull={19}>
          Ajanjakso
          <SideBar
            drawTable={drawTable}
            firstYear={firstYear}
            printYear={printYear}
          />
        </Col>
      </Row>
    </>
  );
};
export default MonthlyWorkingHours;
