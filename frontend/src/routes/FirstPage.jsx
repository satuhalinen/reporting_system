import { auth } from "../auth/authentication";
import { useEffect } from "react";
import axios from "axios";

const FirstPage = () => {
  useEffect(() => {
    const sendTokenToBackend = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          const response = await axios.get(
            "http://localhost:3000/test-endpoint",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              data: JSON.stringify({ message: "Hello from the frontend!" }),
            }
          );

          console.log("Response from backend:", response.data);
        } catch (error) {
          console.error("Error sending token to backend:", error);
        }
      }
    };

    sendTokenToBackend();
  }, []);
  return (
    <>
      <h1>Welcome to reporting system!</h1>
    </>
  );
};
export default FirstPage;
