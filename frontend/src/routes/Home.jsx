import StackedGroupedBar from "../components/StackedGroupedBar";
import groupedData from "./fakeData/groupedData2.json";

const Home = () => {
  const indexKey = "month";
  const groupKeys = ["week1", "week2", "week3", "week4", "week5", "week6"];
  const stackKeys = ["internal", "client", "something", "something2", "something3", "something4"];

  return (
    <div>
      <h1>Home</h1>
      <div style={{height: "600px"}}></div>
      <div style={{height: "300px"}}>
        <StackedGroupedBar indexKey={indexKey} groupKeys={groupKeys} stackKeys={stackKeys} data={groupedData}/>
      </div>
      <div style={{height: "1200px"}}></div>
    </div>
  );
};

export default Home;
