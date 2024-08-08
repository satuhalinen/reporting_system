import { Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { auth } from "../auth/authentication";

const { Title } = Typography;

const Permissions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const fetchNamesAndEmail = async () => {
    const token = await auth.currentUser.getIdToken();
    const response = await axios.get(`http://localhost:3000/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = response.data;
    form.setFieldsValue(userData);
  };

  useEffect(() => {
    fetchNamesAndEmail();
  }, []);

  return (
    <>
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
      >
        <Title>Käyttöoikeudet</Title>
        <Form.Item label="Sukunimi" name="lastname">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Etunimi" name="firstname">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Sähköpostiosoite" name="email">
          <Input disabled />
        </Form.Item>
      </Form>
    </>
  );
};

export default Permissions;
