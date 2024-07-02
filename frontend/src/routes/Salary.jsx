import { Select, Button, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "antd";
import renderFormattedNumber from "../helpers";

const { Title } = Typography;

const Salary = () => {
  const [salaryDates, setSalaryDates] = useState([]);
  const [selectedSalaryDate, setSelectedSalaryDate] = useState(null);
  const [columnNames, setColumnNames] = useState([]);
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
    axios.get(`http://localhost:3000/salary_report`).then((response) => {
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
        groupedData[key][record.report_name] =
          record["SUM(worklog_worklog.worker_hours)"];
        if (!reportNames.includes(record.report_name)) {
          reportNames.push(record.report_name);
        }
      });

      const groupedDataWithTotal = Object.values(groupedData).map((person) => {
        let yhteensä = 0;
        reportNames.forEach((reportName) => {
          if (person[reportName] !== undefined) {
            yhteensä += person[reportName];
          } else {
            person[reportName] = 0;
          }
        });
        return { ...person, yhteensä };
      });

      setTableData(groupedDataWithTotal);

      const columnTitles = [];

      reportNames.forEach((reportName) => {
        columnTitles.push({
          title: reportName,
          dataIndex: reportName,
          key: reportName,
          render: renderFormattedNumber,
          align: "right",
        });
      });

      columnTitles.sort((columnTitleA, columnTitleB) => {
        const titleA = columnTitleA.title;
        const titleB = columnTitleB.title;
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });

      columnTitles.unshift(
        {
          title: "Sukunimi",
          dataIndex: "lastname",
          key: "lastname",
          render: renderFormattedNumber,
          align: "right",
        },
        {
          title: "Etunimi",
          dataIndex: "firstname",
          key: "firstname",
          render: renderFormattedNumber,
          align: "right",
        }
      );

      columnTitles.push({
        title: "Kaikki yhteensä",
        dataIndex: "yhteensä",
        key: "yhteensä",
        render: renderFormattedNumber,
        align: "right",
      });

      setColumnNames(columnTitles);
    });
  };

  return (
    <>
      <Title>Welcome to salary report!</Title>
      <Select
        placeholder="Select salary date"
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
      <Button>Tee CSV</Button>
      <Table columns={columnNames} dataSource={tableData}></Table>
    </>
  );
};

export default Salary;
