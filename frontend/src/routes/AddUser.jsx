import { Button, Form, Input, Typography } from "antd";
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";

const { Title, Text } = Typography;

const AddUser = () => {
  const [message, setMessage] = useState("");
  const { user, loading } = useContext(AuthContext);

  const onFinish = async (values) => {
    axios
      .post(
        "http://localhost:3000/users",
        {
          email: values.email,
          password: values.password,
          lastname: values.lastname,
          firstname: values.firstname,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
      autoComplete="off"
      onFinish={onFinish}
    >
      <Title>Käyttäjän lisääminen</Title>
      <Form.Item
        label="Sukunimi"
        name="lastname"
        rules={[
          {
            required: true,
            message: "Syötä käyttäjän sukunimi!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Etunimi"
        name="firstname"
        rules={[
          {
            required: true,
            message: "Syötä käyttäjän etunimi!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Sähköpostiosoite"
        name="email"
        rules={[
          {
            required: true,
            message: "Syötä käyttäjän sähköpostiosoite!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Salasana"
        name="password"
        rules={[
          {
            required: true,
            message: "Syötä käyttäjän salasana!",
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
          Lisää käyttäjä
        </Button>
        <Text style={{ margin: "10px" }}>{message}</Text>
      </Form.Item>
    </Form>
  );
};
export default AddUser;
