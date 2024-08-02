const renderFormattedNumber = (hours) => {
  if (typeof hours === "number") {
    return hours.toLocaleString("fi-FI", {
      minimumFractionDigits: 1,
    });
  }
  return hours;
};

export default renderFormattedNumber;
