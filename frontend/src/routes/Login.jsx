import { Button, Form, Input, Typography } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../auth/authentication";

const { Title } = Typography;

const onFinish = (values) => {
  signInWithEmailAndPassword(auth, values.email, values.password).then(
    () => {}
  );
};

const Login = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/first-page");
  }, [user]);

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Title>Kirjautuminen</Title>
      <Form.Item
        label="Sähköpostiosoite"
        name="email"
        value="email"
        rules={[
          {
            required: true,
            message: "Syötä sähköpostiosoitteesi!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Salasana"
        name="password"
        value="password"
        rules={[
          {
            required: true,
            message: "Syötä salasanasi!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Kirjaudu sisään
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Login;
