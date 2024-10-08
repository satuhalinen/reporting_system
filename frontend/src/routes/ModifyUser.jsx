import { Button, Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { makeHeaders } from "../helpers";

const { Title, Text } = Typography;

const ModifyUser = () => {
  const [initialValues, setInitialValues] = useState({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");

  const { user, loading } = useContext(AuthContext);

  const fetchNamesAndEmail = async () => {
    const response = await axios.get(`http://localhost:3000/users/${id}`, {
      headers: makeHeaders(user),
    });
    const userData = response.data;
    setInitialValues(userData);
    form.setFieldsValue(userData);
  };

  useEffect(() => {
    if (user) fetchNamesAndEmail();
  }, [user]);

  const onFinish = async (values) => {
    axios
      .post(
        `http://localhost:3000/users/${id}`,
        {
          email: values.email,
          lastname: values.lastname,
          firstname: values.firstname,
        },
        {
          headers: makeHeaders(user),
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
      initialValues={initialValues}
      form={form}
      onFinish={onFinish}
    >
      <Title>Käyttäjän tietojen muokkaaminen</Title>
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
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Tallenna käyttäjän tiedot
        </Button>
        <Text style={{ margin: "10px" }}>{message}</Text>
      </Form.Item>
    </Form>
  );
};

export default ModifyUser;
