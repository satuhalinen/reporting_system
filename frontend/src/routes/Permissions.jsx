import { Form, Input, Typography, Checkbox, Button } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { makeHeaders } from "../helpers";

const { Title, Text } = Typography;

const Permissions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState([]);
  const [message, setMessage] = useState("");

  const { user, loading } = useContext(AuthContext);

  const fetchNamesAndEmail = async () => {
    const response = await axios.get(`http://localhost:3000/users/${id}`, {
      headers: makeHeaders(user),
    });
    const userData = response.data;
    form.setFieldsValue(userData);
  };

  useEffect(() => {
    if (user) fetchNamesAndEmail();
  }, [user]);

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
    axios
      .post(
        `http://localhost:3000/users/${id}/permissions`,
        {
          id: values.id,
          checkboxes: checkedList,
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

  const getCustomClaims = async () => {
    const response = await axios.get(
      `http://localhost:3000/users/${id}/permissions`,
      {
        headers: makeHeaders(user),
      }
    );
    const permissions = Object.entries(response.data);
    const filteredPermissions = permissions.filter((item) => item[1] === true);
    const newPermissions = filteredPermissions.map((item) => item[0]);
    setCheckedList(newPermissions);
  };

  useEffect(() => {
    if (user) getCustomClaims();
  }, [user]);

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
            display: "grid",
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
        <Text style={{ margin: "10px" }}>{message}</Text>
      </Form.Item>
    </Form>
  );
};

export default Permissions;
