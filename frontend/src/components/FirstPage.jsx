import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const FirstPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error!", error);
      });
  }, []);

  return (
    <>
      <h1>Welcome to reporting system!</h1>
      {data.map((item) => (
        <div>{item.id}</div>
      ))}
    </>
  );
};
export default FirstPage;
