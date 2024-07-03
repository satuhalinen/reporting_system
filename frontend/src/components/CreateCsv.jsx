import { Button } from "antd";

const CreateCsv = () => {
  const testData = [
    { title1: "firstRow1", title2: "firstRow2" },
    { title1: "secondRow1", title2: "secondRow2" },
    { title1: "thirdRow1", title2: "thirdRow2" },
  ];

  const generateCsv = () => {
    const titleKeys = Object.keys(testData[0]);
    const transformedData = [];
    transformedData.push(titleKeys);
    testData.forEach((row) => {
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
      <Button onClick={generateCsv}>Luo CSV-tiedosto</Button>
    </div>
  );
};

export default CreateCsv;
