import { Button } from "antd";
import { auth } from "../auth/authentication";
import { useNavigate } from "react-router-dom";

const FirstPage = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <>
      <h1>Welcome to reporting system!</h1>
      <Button onClick={logout}>Log out</Button>
    </>
  );
};
export default FirstPage;
