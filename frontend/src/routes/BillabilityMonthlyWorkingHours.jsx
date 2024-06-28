import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Col, Row, Typography } from "antd";
import StackedGroupedBar from "../components/StackedGroupedBar";
import SideBar from "../components/SideBar";
import renderFormattedNumber from "../helpers";

const { Title } = Typography;

const BillabilityMonthlyWorkingHours = () => {
  const [billableTableData, setBillableTableData] = useState([]);
  const [nonBillableTableData, setNonBillableTableData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYearsBack, setSelectedYearsBack] = useState(3);
  const [graphData, setGraphData] = useState([]);
  const indexKey = "month";

  const years = billableTableData.map((item) => item.year);
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
        const transformedNonBillableTableData = {};
        const transformedData = {};
        const rawData = response.data.data;

        for (let i = 0; i < rawData.length; i++) {
          const year = rawData[i].year;
          const month = rawData[i].month;
          const total_hours = rawData[i].total_hours;
          const billable = rawData[i].billable;

          if (!transformedTableData[year]) {
            transformedTableData[year] = { year: year, total: 0 };
          }
          if (!transformedNonBillableTableData[year]) {
            transformedNonBillableTableData[year] = { year: year, total: 0 };
          }
          if (billable === 0) {
            transformedNonBillableTableData[year][month] =
              (transformedNonBillableTableData[year][month] || 0) + total_hours;
            transformedNonBillableTableData[year].total += total_hours;
          }
          if (!transformedData[month]) {
            transformedData[month] = { month: month };
          }
          if (!transformedData[month][year]) {
            transformedData[month][year] = {
              billable: 0,
              non_billable: 0,
            };
          }
          if (billable === 1) {
            transformedTableData[year][month] =
              (transformedTableData[year][month] || 0) + total_hours;
            transformedTableData[year].total += total_hours;
            transformedData[month][year].billable = total_hours;
          } else {
            transformedData[month][year].non_billable = total_hours;
          }
        }

        setBillableTableData(Object.values(transformedTableData));
        setNonBillableTableData(Object.values(transformedNonBillableTableData));
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
    align: "right",
  });
  for (let i = 1; i < 13; i++) {
    columns.push({
      title: i,
      dataIndex: i,
      key: i,
      render: renderFormattedNumber,
      align: "right",
    });
  }
  columns.push({
    title: "Yhteensä",
    dataIndex: "total",
    key: "total",
    render: renderFormattedNumber,
    align: "right",
  });

  return (
    <Row>
      <Title>
        {yearsAmount !== 1
          ? `Tunnit - laskutettavat ja ei-laskutettavat vuosina ${years[0]} - ${
              years[yearsAmount - 1]
            }`
          : `Tunnit - laskutettavat ja ei-laskutettavat vuotena ${years[0]}`}
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
        <Title level={2}>Laskutettavat tunnit</Title>
        <Table columns={columns} dataSource={billableTableData} />
      </Col>
      <Col span={19} push={5}>
        <Title level={2}>Ei-laskutettavat tunnit</Title>
        <Table columns={columns} dataSource={nonBillableTableData} />
      </Col>
    </Row>
  );
};
export default BillabilityMonthlyWorkingHours;
