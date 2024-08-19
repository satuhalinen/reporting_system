export const renderFormattedNumber = (hours) => {
  if (typeof hours === "number") {
    return hours.toLocaleString("fi-FI", {
      minimumFractionDigits: 1,
    });
  }
  return hours;
};

export const makeHeaders = (user) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.accessToken}`,
  };
};
