import React, { useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import CustomBar from "./CustomBar";

const commonProps = {
  margin: { top: 60, right: 80, bottom: 60, left: 80 },
};

const StackedGroupedBar = ({ data, indexKey, groupKeys, stackKeys }) => {
  const customToolTipRef = useRef(null);

  const transformedData = data.map((item) => {
    console.log(item);
    const transformedItem = { detailedData: { ...item }, [indexKey]: item[indexKey] };
    Object.keys(item).filter(key => groupKeys.includes(key)).forEach(
      (key) => transformedItem[key] = Object.values(item[key]).reduce((acc, curr) => acc + curr, 0)
    );

    return transformedItem;
  });

  console.log(transformedData);

  return <>
      <ResponsiveBar
        {...commonProps}
        data={transformedData}
        indexBy={indexKey}
        keys={groupKeys}
        padding={0.15}
        innerPadding={8}
        barComponent={(barProps) => {
          return (
            <CustomBar
              barItemData={barProps.bar}
              tooltipRef={customToolTipRef}
              stackKeys={stackKeys}
            />
          );
        }}
        groupMode="grouped"
      />
    <div className="custom_tooltip" ref={customToolTipRef}></div>
  </>;
};

export default StackedGroupedBar;