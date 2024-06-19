import axios from "axios";
import { useEffect, useState } from "react";
import StackedGroupedBar from "../components/StackedGroupedBar";

const BillabilityMonthlyWorkingHours = () => {
  const [graphData, setGraphData] = useState([]);
  const indexKey = "month";
  const groupKeys = ["year2024", "year2023"];
  const stackKeys = ["billable", "non_billable"];

  const applyFilters = () => {
    axios
      .get(`http://localhost:3000/billability-working-hours/2024/1`)
      .then((response) => {
        const rawData = response.data.data;
        var transformedData = {};

        for (var i = 0; i < rawData.length; i++) {
          var year = rawData[i].year;
          var month = rawData[i].month;
          var total_hours = rawData[i].total_hours;
          var billable = rawData[i].billable;
          if (!transformedData[month]) {
            transformedData[month] = { month: month };
          }
          if (!transformedData[month]["year" + year]) {
            transformedData[month]["year" + year] = {
              billable: 0,
              non_billable: 0,
            };
          }
          if (billable === 1) {
            transformedData[month]["year" + year].billable = total_hours;
          } else {
            transformedData[month]["year" + year].non_billable = total_hours;
          }
        }
        setGraphData(Object.values(transformedData));
      });
  };

  useEffect(() => {
    applyFilters();
  }, []);

  return (
    <>
      <h1>Welcome to billability page!</h1>
      <div style={{ height: "300px" }}>
        <StackedGroupedBar
          indexKey={indexKey}
          groupKeys={groupKeys}
          stackKeys={stackKeys}
          data={graphData}
        />
      </div>
    </>
  );
};
export default BillabilityMonthlyWorkingHours;
