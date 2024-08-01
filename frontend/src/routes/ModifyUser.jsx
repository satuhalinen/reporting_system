import { Button, Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const { Title } = Typography;

const ModifyUser = () => {
  const { id } = useParams();
  console.log("id", id);

  const fetchNames = async () => {
    const response = await axios.get(`http://localhost:3000/modify-user/${id}`);
  };

  useEffect(() => {
    fetchNames();
  }, []);

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
    >
      <Title>Käyttäjän tietojen muokkaaminen</Title>
      <Form.Item label="Sukunimi" name="lastname">
        <Input />
      </Form.Item>
      <Form.Item label="Etunimi" name="firstname">
        <Input />
      </Form.Item>
      <Form.Item label="Sähköpostiosoite" name="email">
        <Input />
      </Form.Item>

      <Form.Item label="Salasana" name="password">
        <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Tallenna käyttäjän tiedot
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModifyUser;
