import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Col, Row, Typography } from "antd";
import SideBar from "../components/SideBar";
import { ResponsiveBar } from "@nivo/bar";

const { Title } = Typography;

const CumulativeMonthlyWorkingHours = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYearsBack, setSelectedYearsBack] = useState(3);
  const [graphData, setGraphData] = useState([]);

  const onYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const applyFilters = () => {
    axios
      .get(
        `http://localhost:3000/monthly-working-hours/${selectedYear}/${selectedYearsBack}`
      )
      .then((response) => {
        const transformedTableData = {};
        let cumulativeTableHours = 0;

        for (let i = 0; i < response.data.data.length; i++) {
          const item = response.data.data[i];
          if (!transformedTableData[item.year]) {
            cumulativeTableHours = 0;
            transformedTableData[item.year] = { year: item.year, total: 0 };
          }
          cumulativeTableHours = cumulativeTableHours + item.total_hours;
          transformedTableData[item.year][item.month] = cumulativeTableHours;
          transformedTableData[item.year].total += item.total_hours;
        }
        const objectValues = Object.values(transformedTableData);

        const roundTableData = (rawData) => {
          return rawData.map((entry) => {
            const roundedEntry = { year: entry.year };
            for (const key in entry) {
              if (key !== "year") {
                roundedEntry[key] = Math.round(entry[key]);
              }
            }
            return roundedEntry;
          });
        };

        setTableData(roundTableData(objectValues));

        const transformedGraphData = {};
        let cumulativeGraphHours = 0;
        for (let i = 0; i < response.data.data.length; i++) {
          const item = response.data.data[i];
          if (!transformedGraphData[item.year]) {
            cumulativeGraphHours = 0;
            transformedGraphData[item.year] = { year: item.year, total: 0 };
          }
          cumulativeGraphHours = cumulativeGraphHours + item.total_hours;
          transformedGraphData[item.year][item.month] = cumulativeGraphHours;
          transformedGraphData[item.year].total += item.total_hours;
        }

        const months = {};
        const dataForGraph = [];

        for (const year in transformedGraphData) {
          for (const month in transformedGraphData[year]) {
            if (!isNaN(month)) {
              if (!months[month]) {
                months[month] = {};
              }
              months[month][year] = transformedGraphData[year][month];
            }
          }
        }

        for (const month in months) {
          const entry = { month: parseInt(month) };
          for (const year in transformedGraphData) {
            entry[year] = months[month][year] || 0;
          }
          dataForGraph.push(entry);
        }
        dataForGraph.sort((a, b) => a.month - b.month);

        setGraphData(dataForGraph);
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
    render: (text) => <b>{text}</b>,
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

  const years = tableData.map((item) => item.year);
  const yearsAmount = years.length;

  return (
    <Row>
      <Title>
        {yearsAmount !== 1
          ? ` Kumulatiiviset työtunnit kuukausittain vuosina ${years[0]} - ${
              years[yearsAmount - 1]
            }`
          : ` Kumulatiiviset työtunnit kuukausittain vuotena ${years[0]}`}
      </Title>
      <Col style={{ height: "250px" }} span={19} push={5}>
        <ResponsiveBar
          groupMode="grouped"
          data={graphData}
          keys={years}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "kuukausi",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "työtunnit",
            legendPosition: "middle",
            legendOffset: -55,
            truncateTickAt: 0,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
            e.id + ": " + e.formattedValue + " in vuosi: " + e.indexValue
          }
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
export default CumulativeMonthlyWorkingHours;
