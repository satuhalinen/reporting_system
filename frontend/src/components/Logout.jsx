import { auth } from "../auth/authentication";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Logout = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <Button style={{ color: "black" }} onClick={logout}>
      Kirjaudu ulos
    </Button>
  );
};

export default Logout;
