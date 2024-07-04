import { Button, Form, Input, Typography } from "antd";

const { Title } = Typography;

const AddUser = () => {
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
        value="email"
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
        value="password"
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
      </Form.Item>
    </Form>
  );
};
export default AddUser;
