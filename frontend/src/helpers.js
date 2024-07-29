const renderFormattedNumber = (hours) => {
  if (typeof hours === "number") {
    return Number(hours.toFixed(2)).toLocaleString("fi-FI", {
      minimumFractionDigits: 1,
    });
  }
  return hours;
};

export default renderFormattedNumber;
