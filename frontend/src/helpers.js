const renderFormattedNumber = (hours) => {
  if (typeof hours === "number") {
    return Math.round(hours).toLocaleString("fi-FI");
  }
  return hours;
};

export default renderFormattedNumber;
