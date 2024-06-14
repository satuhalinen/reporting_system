import React from "react";

const getCustomToolTipHTML = (dayName = "", type, hours) => {
  return `<span><strong>${dayName} </strong> <span>${type}</span>: <strong>${hours}</strong> hrs</span>`;
};

const colors = ['#4A8DF2', '#9155DD', '#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5'];

const CustomBar = ({ barItemData, tooltipRef, stackKeys }) => {
  const { x, y, width, height, data } = barItemData;
  const detailedData = data.data.detailedData;
  const selectedDateData = detailedData[data.id];
  const totalWeek = data.data.totalWeek;

  const isLastWeek = data.id === `week${totalWeek}`;

  const heightValue = data.value;
  const heightScalePercentage = height / heightValue;

  const onMouseHoverHandler = (event, action, type) => {
    const relativeXPos = event.pageX;
    const relativeYPos = event.pageY;

    const xPosCenter = relativeXPos - 60; //60: Assumed width of tooltip
    const yPosCenter = relativeYPos - 40;

    if (!tooltipRef.current) {
      return;
    }

    tooltipRef.current.style.transform = `translate(${xPosCenter}px, ${yPosCenter}px)`;

    if (action === "move") {
      return;
    }
    const hrsValue = selectedDateData[type];

    tooltipRef.current.style.display = "inline-flex";
    tooltipRef.current.innerHTML = getCustomToolTipHTML(
      selectedDateData.dayName,
      type,
      hrsValue
    );
  };

  const onMouseLeaveHandler = (event) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
    }
  };

  let currentHeight = 0;

  return (
    <g>
      {stackKeys.filter(k => Object.keys(selectedDateData).includes(k)).map((key) => {
        const index = stackKeys.indexOf(key);
        const value = selectedDateData[key];
        const rectElem = (
          <rect
            key={key}
            fill={colors[index % colors.length]}
            height={heightScalePercentage * value}
            width={width}
            x={x}
            y={y + height - value * heightScalePercentage - currentHeight}
            onMouseEnter={(event) =>
              onMouseHoverHandler(event, "enter", key)
            }
            onMouseMove={(event) => onMouseHoverHandler(event, "move", key)}
            onMouseLeave={onMouseLeaveHandler}
          />
        );

        currentHeight += value * heightScalePercentage;

        return rectElem;
      })}
      <rect
        x={x}
        y={y + height + 2}
        height={2}
        fill="#7A7A7A"
        width={isLastWeek ? width : width + 12}
      />
    </g>
  );
};

export default CustomBar;
