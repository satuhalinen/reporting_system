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

  let finnishDate = "";
  let finnishDateNoDots = "";
  let fileName = "";

  if (selectedSalaryDate) {
    let year = selectedSalaryDate.slice(0, 4);
    const month = selectedSalaryDate.slice(5, 7);
    const day = selectedSalaryDate.slice(8, 10);
    finnishDate = day + "." + month + "." + year;
    finnishDateNoDots = year + month + day;
    fileName = `palkat_${finnishDateNoDots}`;
  }

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
              Sukunimi: record.lastname,
              Etunimi: record.firstname,
            };
          }
          groupedData[key][record.report_name] = record.hours;
          if (!reportNames.includes(record.report_name)) {
            reportNames.push(record.report_name);
          }
        });

        const groupedDataWithTotal = Object.values(groupedData).map(
          (person) => {
            let yhteensä = 0;
            reportNames.forEach((reportName) => {
              if (person[reportName] !== undefined) {
                yhteensä += person[reportName];
              } else {
                person[reportName] = 0;
              }
            });
            return { ...person, "Kaikki yhteensä": yhteensä };
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
            dataIndex: "Sukunimi",
            key: "Sukunimi",
          },
          {
            title: "Etunimi",
            dataIndex: "Etunimi",
            key: "Etunimi",
          }
        );

        newColumns.push({
          title: "Kaikki yhteensä",
          dataIndex: "Kaikki yhteensä",
          key: "Kaikki yhteensä",
          render: renderFormattedNumber,
          align: "right",
        });

        setColumns(newColumns);
      });
  };

  return (
    <>
      <Title>
        Palkkaraportti {tableData.length !== 0 ? finnishDate : null}
      </Title>
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
      <CreateCsv
        tableData={tableData}
        selectedSalaryDate={selectedSalaryDate}
        fileName={fileName}
      ></CreateCsv>
      <Table columns={columns} dataSource={tableData}></Table>
    </>
  );
};

export default Salary;
