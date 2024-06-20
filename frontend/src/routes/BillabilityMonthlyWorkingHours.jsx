import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Col, Row, Typography } from "antd";
import StackedGroupedBar from "../components/StackedGroupedBar";
import SideBar from "../components/SideBar";

const { Title } = Typography;

const BillabilityMonthlyWorkingHours = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYearsBack, setSelectedYearsBack] = useState(3);
  const [graphData, setGraphData] = useState([]);
  const indexKey = "month";

  const years = tableData.map((item) => item.year);
  const yearsAmount = years.length;

  const groupKeys = years.map((year) => String(year));

  const stackKeys = ["billable", "non_billable"];

  const onYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const applyFilters = () => {
    axios
      .get(
        `http://localhost:3000/billability-working-hours/${selectedYear}/${selectedYearsBack}`
      )
      .then((response) => {
        const transformedTableData = {};
        const rawTableData = response.data.data;

        for (let i = 0; i < rawTableData.length; i++) {
          const year = rawTableData[i].year;
          const month = rawTableData[i].month;
          const total_hours = rawTableData[i].total_hours;
          const billable = rawTableData[i].billable;

          if (!transformedTableData[year]) {
            transformedTableData[year] = { year: year, total: 0 };
          }
          if (billable === 1) {
            transformedTableData[year][month] =
              (transformedTableData[year][month] || 0) + total_hours;
            transformedTableData[year].total += total_hours;
          }
        }

        setTableData(Object.values(transformedTableData));
        const rawData = response.data.data;
        const transformedData = {};

        for (let j = 0; j < rawData.length; j++) {
          const graphYear = rawData[j].year;
          const graphMonth = rawData[j].month;
          const graphTotal_hours = rawData[j].total_hours;
          const graphBillable = rawData[j].billable;
          if (!transformedData[graphMonth]) {
            transformedData[graphMonth] = { month: graphMonth };
          }
          if (!transformedData[graphMonth][graphYear]) {
            transformedData[graphMonth][graphYear] = {
              billable: 0,
              non_billable: 0,
            };
          }
          if (graphBillable === 1) {
            transformedData[graphMonth][graphYear].billable = graphTotal_hours;
          } else {
            transformedData[graphMonth][graphYear].non_billable =
              graphTotal_hours;
          }
        }
        setGraphData(Object.values(transformedData));
      });
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const columns = [];
  columns.push({
    title: "Vuosi",
    dataIndex: "year",
    key: "year",
    render: (title) => <b>{title}</b>,
  });
  for (let i = 1; i < 13; i++) {
    columns.push({
      title: i,
      dataIndex: i,
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
      <Title>
        Tunnit - laskutettavat ja ei-laskutettavat vuosina {years[0]} -
        {years[yearsAmount - 1]}
      </Title>
      <Col style={{ height: "250px" }} span={19} push={5}>
        <StackedGroupedBar
          indexKey={indexKey}
          groupKeys={groupKeys}
          stackKeys={stackKeys}
          data={graphData}
        />
      </Col>
      <Col style={{ marginTop: "2%" }} span={5} pull={19}>
        Ajanjakso
        <SideBar
          onYearChange={onYearChange}
          selectedYear={selectedYear}
          applyFilters={applyFilters}
          setSelectedYearsBack={setSelectedYearsBack}
          selectedYearsBack={selectedYearsBack}
        />
      </Col>
      <Col span={19} push={5}>
        <Table columns={columns} dataSource={tableData} />
      </Col>
    </Row>
  );
};
export default BillabilityMonthlyWorkingHours;
