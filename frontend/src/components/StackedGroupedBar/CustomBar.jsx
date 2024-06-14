import React from "react";

const getCustomToolTipHTML = (dayName = "", type, hours) => {
  return `<span><strong>${dayName} </strong> <span>${type}</span>: <strong>${hours}</strong> hrs</span>`;
};

const CustomBar = ({ barItemData, tooltipRef }) => {
  //console.log(barItemData);
  const { x, y, width, height, data } = barItemData;
  const detailedData = data.data.detailedData;
  const selectedDateData = detailedData[data.id];
  const totalWeek = data.data.totalWeek;

  const isLastWeek = data.id === `week${totalWeek}`;

  const heightValue = data.value;
  const heightScalePercentage = height / heightValue;
  const internalHeightInPX = selectedDateData.internal * heightScalePercentage;
  const clientHeightInPX = selectedDateData.client * heightScalePercentage;

  const clientHeightYCoordinate = y + height - clientHeightInPX;
  const internalHeightYCoordinate = y + height - internalHeightInPX;

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

  return (
    <g>
      <rect
        fill={"#4A8DF2"}
        height={internalHeightInPX}
        width={width}
        x={x}
        y={internalHeightYCoordinate - clientHeightInPX}
        onMouseEnter={(event) =>
          onMouseHoverHandler(event, "enter", "internal")
        }
        onMouseMove={(event) => onMouseHoverHandler(event, "move", "internal")}
        onMouseLeave={onMouseLeaveHandler}
      />
      <rect
        fill={"#9155DD"}
        height={clientHeightInPX}
        width={width}
        x={x}
        y={clientHeightYCoordinate}
        onMouseEnter={(event) => onMouseHoverHandler(event, "enter", "client")}
        onMouseMove={(event) => onMouseHoverHandler(event, "move", "client")}
        onMouseLeave={onMouseLeaveHandler}
      />
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
