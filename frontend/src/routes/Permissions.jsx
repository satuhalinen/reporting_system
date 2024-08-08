import { Form, Input, Typography, Checkbox, Col, Row } from "antd";
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

  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
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
      <Typography.Title
        level={2}
        style={{
          marginLeft: "200px",
        }}
      >
        Käyttäjän tiedot
      </Typography.Title>
      <Form.Item label="Sukunimi" name="lastname">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Etunimi" name="firstname">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Sähköpostiosoite" name="email">
        <Input disabled />
      </Form.Item>
      <Form.Item style={{ marginLeft: "200px" }}>
        <Typography.Title level={2}>
          Käyttäjän oikeudet raportteihin
        </Typography.Title>
        <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={onChange}
        >
          <Row>
            <Col span={24}>
              <Checkbox value="A">
                Kaikki tunnit kumulatiivinen raportti
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="B">Kaikki tunnit raportti</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="C">Laskutettavat tunnit raportti</Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox value="D">Palkkaraportti</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
};

export default Permissions;
