import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Col, Row, Typography } from "antd";
import SideBar from "../components/SideBar";
import { ResponsiveBar } from "@nivo/bar";

const MonthlyWorkingHours = () => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedYearsBack, setSelectedYearsBack] = useState(3);
  const [dataGraph, setDataGraph] = useState([]);
  const { Title } = Typography;

  const onYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const onYearsBackChange = (value) => {
    setSelectedYearsBack(value);
  };

  const applyFilters = () => {
    makeTableData();
    makeGraphData();
  };

  const makeTableData = () => {
    axios
      .get(
        `http://localhost:3000/monthly-working-hours/${selectedYear}/${selectedYearsBack}`
      )
      .then((response) => {
        const transformedData = {};
        for (let i = 0; i < response.data.data.length; i++) {
          const item = response.data.data[i];
          if (!transformedData[item.year]) {
            transformedData[item.year] = { year: item.year, total: 0 };
          }
          transformedData[item.year][item.month] = item.total_hours;
          transformedData[item.year].total += item.total_hours;
        }
        setData(Object.values(transformedData));
      });
  };

  const makeGraphData = () => {
    axios
      .get(
        `http://localhost:3000/monthly-working-hours/${selectedYear}/${selectedYearsBack}`
      )
      .then((response) => {
        const transformedData = {};
        for (let i = 0; i < response.data.data.length; i++) {
          const item = response.data.data[i];
          if (!transformedData[item.year]) {
            transformedData[item.year] = { year: item.year, total: 0 };
          }
          transformedData[item.year][item.month] = item.total_hours;
          transformedData[item.year].total += item.total_hours;
        }

        const months = {};
        const dataForGraph = [];

        for (const year in transformedData) {
          for (const month in transformedData[year]) {
            if (!isNaN(month)) {
              if (!months[month]) {
                months[month] = {};
              }
              months[month][year] = transformedData[year][month];
            }
          }
        }

        for (const month in months) {
          const entry = { month: parseInt(month) };
          for (const year in transformedData) {
            entry[year] = months[month][year] || 0;
          }
          dataForGraph.push(entry);
        }
        dataForGraph.sort((a, b) => a.month - b.month);

        setDataGraph(dataForGraph);
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

  const years = data.map((item) => item.year);
  const yearsAmount = years.length;

  return (
    <Row>
      <Title>
        Työtunnit kuukausittain vuosina {years[0]} - {years[yearsAmount - 1]}
      </Title>
      <Col style={{ height: "250px" }} span={24}>
        <ResponsiveBar
          groupMode="grouped"
          data={dataGraph}
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
            legendOffset: -40,
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
      <Col span={19} push={5}>
        <Table columns={columns} dataSource={data} />{" "}
      </Col>
      <Col span={5} pull={19}>
        Ajanjakso
        <SideBar
          onYearChange={onYearChange}
          selectedYear={selectedYear}
          applyFilters={applyFilters}
          onYearsBackChange={onYearsBackChange}
          selectedYearsBack={selectedYearsBack}
        />
      </Col>
    </Row>
  );
};
export default MonthlyWorkingHours;
