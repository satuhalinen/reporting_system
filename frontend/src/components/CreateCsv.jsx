import { Button } from "antd";

const CreateCsv = ({ tableData }) => {
  const generateCsv = () => {
    const titleKeys = Object.keys(tableData[0]);
    const transformedData = [];
    transformedData.push(titleKeys);
    tableData.forEach((row) => {
      transformedData.push(Object.values(row));
    });
    let csvContent = "";
    transformedData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objUrl;
    link.download = "file.csv";
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
