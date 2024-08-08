import { Form, Input, Typography, Checkbox, Button } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { auth } from "../auth/authentication";

const { Title, Text } = Typography;

const Permissions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState([]);
  const [message, setMessage] = useState("");

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

  const options = [
    {
      label: "Kaikki tunnit kumulatiivinen",
      value: "Kaikki tunnit kumulatiivinen",
    },
    { label: "Kaikki tunnit", value: "Kaikki tunnit" },
    {
      label: "Laskutettavat tunnit",
      value: "Laskutettavat tunnit",
    },
    {
      label: "Palkka",
      value: "Palkka",
    },
  ];

  const handleChange = (list) => {
    setCheckedList(list);
  };

  const handleSave = async (values) => {
    const token = await auth.currentUser.getIdToken();
    axios
      .post(
        `http://localhost:3000/users/${id}/permissions`,
        {
          id: values.id,
          checkboxes: checkedList,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    >
      <Title>Käyttöoikeudet raportteihin</Title>
      <Typography.Title level={2}>Käyttäjän tiedot</Typography.Title>
      <Form.Item label="Sukunimi" name="lastname">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Etunimi" name="firstname">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Sähköpostiosoite" name="email">
        <Input disabled />
      </Form.Item>
      <Typography.Title level={2}>
        Käyttäjän oikeudet raportteihin
      </Typography.Title>
      <Form.Item name="checkboxes" valuePropName="checked">
        <Checkbox.Group
          options={options}
          value={checkedList}
          onChange={handleChange}
          style={{
            width: "100%",
            marginLeft: "50%",
          }}
        ></Checkbox.Group>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button onClick={handleSave} type="primary" htmlType="submit">
          Tallenna käyttöoikeudet
        </Button>
        <Text>{message}</Text>
      </Form.Item>
    </Form>
  );
};

export default Permissions;
