import { Select, Button, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";

const { Title } = Typography;

const Salary = () => {
  const [salaryDates, setSalaryDates] = useState([]);
  const [selectedSalaryDate, setSelectedSalaryDate] = useState(null);

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
      <Button>
        <SearchOutlined />
        Hae
      </Button>
      <Button>Tee CSV</Button>
    </>
  );
};

export default Salary;
