import { Button, Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const ChangePassword = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");

  const fetchNamesAndEmail = async () => {
    const response = await axios.get(`http://localhost:3000/users/${id}`);
    const userData = response.data;
    form.setFieldsValue(userData);
  };

  useEffect(() => {
    fetchNamesAndEmail();
  }, []);

  const onFinish = (values) => {
    axios
      .post(`http://localhost:3000/users/${id}/change-password/`, {
        password: values.password,
      })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

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
      form={form}
      onFinish={onFinish}
    >
      <Title>Käyttäjän salasanan vaihtaminen</Title>
      <Form.Item label="Sukunimi" name="lastname">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Etunimi" name="firstname">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Sähköpostiosoite" name="email">
        <Input disabled />
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
          Tallenna käyttäjän salasana
        </Button>
        <Text>{message}</Text>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
