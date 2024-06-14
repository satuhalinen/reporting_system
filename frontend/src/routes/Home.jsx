import StackedGroupedBar from "../components/StackedGroupedBar";
import groupedData from "../components/StackedGroupedBar/fakeData/groupedData.json";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <StackedGroupedBar data={groupedData}/>
    </div>
  );
};

export default Home;
