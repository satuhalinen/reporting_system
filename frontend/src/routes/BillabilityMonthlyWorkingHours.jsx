import axios from "axios";
import { useEffect, useState } from "react";
import StackedGroupedBar from "../components/StackedGroupedBar";

const BillabilityMonthlyWorkingHours = () => {
  const [graphData, setGraphData] = useState([]);
  const indexKey = "month";
  const groupKeys = ["2024", "2023", "2022"];
  const stackKeys = ["billable", "non-billable"];
  const applyFilters = () => {
    axios
      .get(`http://localhost:3000/billability-working-hours/2024/2`)
      .then((response) => {
        const result = [];
        const rawData = response.data.data;

        rawData.forEach((entry) => {
          let monthEntry = result.find((e) => e.month === entry.month);

          if (!monthEntry) {
            monthEntry = { month: entry.month };
            result.push(monthEntry);
          }

          if (!monthEntry[entry.year]) {
            monthEntry[entry.year] = { billable: 0, "non-billable": 0 };
          }

          if (entry.billable) {
            monthEntry[entry.year].billable += 1;
          } else {
            monthEntry[entry.year]["non-billable"] += 1;
          }
        });

        setGraphData(result);
      })
      .catch((error) => {
        console.error("There was an error!", error);
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
