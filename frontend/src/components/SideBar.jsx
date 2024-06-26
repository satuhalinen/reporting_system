import { Input, Select, Button, Col } from "antd";

const SideBar = ({
  onYearChange,
  selectedYear,
  selectedYearsBack,
  setSelectedYearsBack,
  applyFilters,
}) => {
  return (
    <>
      <p>Vuosi</p>
      <Input
        onChange={onYearChange}
        maxLength={4}
        placeholder="vuosi"
        value={selectedYear}
        style={{
          width: "35%",
        }}
      />
      <p>Vertailu edelliset vuodet, lkm (0-3)</p>
      <Select
        onChange={setSelectedYearsBack}
        value={selectedYearsBack}
        showSearch
        style={{
          width: "15%",
        }}
        placeholder="Search to Select"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? "").includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={[
          {
            value: "0",
            label: "0",
          },
          {
            value: "1",
            label: "1",
          },
          {
            value: "2",
            label: "2",
          },
          {
            value: "3",
            label: "3",
          },
        ]}
      />
      <Col>
        <Button onClick={applyFilters} style={{ marginTop: "5%" }}>
          Suorita
        </Button>
      </Col>
    </>
  );
};
export default SideBar;
