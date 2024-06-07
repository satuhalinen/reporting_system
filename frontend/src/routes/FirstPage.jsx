import { useState, useEffect } from "react";
import axios from "axios";

const FirstPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000").then((response) => {
      setData(response.data.data);
    });
  }, []);

  return (
    <>
      <h1>Welcome to reporting system!</h1>
      {data.map((item) => (
        <div key={item.id}>{item.id}</div>
      ))}
    </>
  );
};
export default FirstPage;
