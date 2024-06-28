const FormatNumber = (hours) => {
  return Math.round(hours).toLocaleString("fi-FI");
};

export default FormatNumber;
