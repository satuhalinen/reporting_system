import { Input, Select, Button } from "antd";

const SideBar = () => {
  return (
    <>
      <p>Vuosi</p>
      <Input maxLength={4} placeholder="Basic usage" />
      <p>Vertailu edelliset vuodet, lkm (0-3)</p>
      <Select
        showSearch
        style={{
          width: 200,
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
      <Button>Suorita</Button>
    </>
  );
};
export default SideBar;
