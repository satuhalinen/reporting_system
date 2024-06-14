import React, { useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import groupedData from "./fakeData/groupedData.json";
import CustomBar from "./CustomBar";

const keys = ["week1", "week2", "week3", "week4", "week5", "week6"];
const commonProps = {
  margin: { top: 60, right: 80, bottom: 60, left: 80 },
};

const StackedGroupedBar = ({ data }) => {
  const containerRef = useRef(null);
  const customToolTipRef = useRef(null);

  return <>
    <div style={{ height: "250px", minWidth: "700px", paddingTop: "50px" }} ref={containerRef} >
      <ResponsiveBar
        {...commonProps}
        data={groupedData}
        indexBy="month"
        keys={keys}
        padding={0.1}
        innerPadding={10}
        barComponent={(barProps) => {
          const bar = barProps.bar;
          const barItemData = {
            x: bar.x,
            y: bar.y,
            width: bar.width,
            height: bar.height,
            data: bar.data,
          };
          return (
            <CustomBar
              barItemData={barItemData}
              tooltipRef={customToolTipRef}
              containerRef={containerRef}
            />
          );
        }}
        groupMode="grouped"
        axisLeft={{
          tickSize: 0,
          tickPadding: 12,
          tickValues: [3, 6, 9, 12, 15, 18, 21],
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
        }}
        gridYValues={[0, 3, 6, 9, 12, 15, 18, 21]}
        enableLabel={false}
      />
    </div>
    <div className="custom_tooltip" ref={customToolTipRef}></div>
  </>;
};

export default StackedGroupedBar;