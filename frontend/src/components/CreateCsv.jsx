import { Button } from "antd";

const CreateCsv = ({ tableData, fileName }) => {
  const generateCsv = () => {
    const titleKeys = Object.keys(tableData[0]);
    const transformedData = [];
    transformedData.push(titleKeys);

    tableData.forEach((row) => {
      let transformedRow = [];

      Object.values(row).forEach((value) => {
        let transformedValue = value;

        if (typeof value === "number" && value.toString().includes(".")) {
          transformedValue = value.toString().replace(".", ",");
        }
        transformedRow.push(transformedValue);
      });

      transformedData.push(transformedRow);
    });
    let csvContent = "\ufeff"; // Byte Order Mark (BOM) for that Excel encodes diaeresis (¨) correctly
    transformedData.forEach((row) => {
      csvContent += row.join(";") + "\n";
    });
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8,",
    });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objUrl;
    link.download = `${fileName}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objUrl);
  };

  return (
    <div>
      <Button onClick={generateCsv} disabled={tableData.length === 0}>
        Luo CSV-tiedosto
      </Button>
    </div>
  );
};

export default CreateCsv;
