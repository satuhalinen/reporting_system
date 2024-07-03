import { Select, Button, Typography, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import renderFormattedNumber from "../helpers";
import CreateCsv from "../components/CreateCsv";

const { Title } = Typography;

const Salary = () => {
  const [salaryDates, setSalaryDates] = useState([]);
  const [selectedSalaryDate, setSelectedSalaryDate] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const getDate = () => {
    axios.get(`http://localhost:3000/salary`).then((response) => {
      const rawSalaryDateData = response.data.data;
      const transformedSalaryDate = rawSalaryDateData.map((dateObject) => ({
        value: dateObject.date,
        label: dateObject.date,
      }));
      setSalaryDates(transformedSalaryDate);
    });
  };

  useEffect(() => {
    getDate();
  }, []);

  const getHours = () => {
    axios
      .get(`http://localhost:3000/salary_report/${selectedSalaryDate}`)
      .then((response) => {
        const rawSalaryHoursData = response.data.data;
        const groupedData = {};
        const reportNames = [];

        rawSalaryHoursData.forEach((record) => {
          const key = `${record.lastname},${record.firstname}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              lastname: record.lastname,
              firstname: record.firstname,
            };
          }
          groupedData[key][record.report_name] = record.hours;
          if (!reportNames.includes(record.report_name)) {
            reportNames.push(record.report_name);
          }
        });

        const groupedDataWithTotal = Object.values(groupedData).map(
          (person) => {
            let total = 0;
            reportNames.forEach((reportName) => {
              if (person[reportName] !== undefined) {
                total += person[reportName];
              } else {
                person[reportName] = 0;
              }
            });
            return { ...person, total };
          }
        );

        setTableData(groupedDataWithTotal);

        const newColumns = reportNames.map((reportName) => ({
          title: reportName,
          dataIndex: reportName,
          key: reportName,
          render: renderFormattedNumber,
          align: "right",
        }));

        newColumns.sort((columnA, columnB) => {
          const titleA = columnA.title;
          const titleB = columnB.title;
          if (titleA < titleB) {
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }
          return 0;
        });

        newColumns.unshift(
          {
            title: "Sukunimi",
            dataIndex: "lastname",
            key: "lastname",
          },
          {
            title: "Etunimi",
            dataIndex: "firstname",
            key: "firstname",
          }
        );

        newColumns.push({
          title: "Kaikki yhteensä",
          dataIndex: "total",
          key: "total",
          render: renderFormattedNumber,
          align: "right",
        });

        setColumns(newColumns);
      });
  };

  return (
    <>
      <Title>Palkkaraportti</Title>
      <Select
        placeholder="Valitse palkanmaksupäivä"
        style={{
          width: "15%",
        }}
        options={salaryDates}
        value={selectedSalaryDate}
        onChange={setSelectedSalaryDate}
      ></Select>
      <Button onClick={getHours}>
        <SearchOutlined />
        Hae
      </Button>
      <CreateCsv tableData={tableData}></CreateCsv>
      <Table columns={columns} dataSource={tableData}></Table>
    </>
  );
};

export default Salary;
