import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { useTranslation } from 'next-i18next';

interface UserFormProps {
  visible: boolean;
  user?: any;
  onCreate: (values: any) => void;
  onUpdate: (id: string, values: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ visible, user, onCreate, onUpdate, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const onFinish = (values: any) => {
    if (user) {
      onUpdate(user.id, values);
    } else {
      onCreate(values);
    }
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={user ? t('Update User') : t('Create User')}
      onCancel={onCancel}
      footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label={t('name')} rules={[{ required: true, message: t('Please input name!') as string }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label={t('username')} rules={[{ required: true, message: t('Please input username!') as string }]}>
          <Input disabled={user ? true : false} />
        </Form.Item>
        {user ? null : (
          <>
            <Form.Item
              name="password"
              label={t('password')} 
              rules={[{ required: true, message: t('Please input Password!') as string }]}
            >
              <Input.Password autoComplete="new-password"/>
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={t('confirm password')}
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: t('Please confirm your password!') as string,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t('The two passwords that you entered do not match!') as string)
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}
        <Form.Item name="email" label={t('email')} rules={[{ required: true, message: t('Please input email!') as string }]}>
          <Input />
        </Form.Item>
        <Form.Item name="emailVerified" label={t('emailVerified')}>
          <Input readOnly />
        </Form.Item>
        <Form.Item>
        <Space direction="horizontal" style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary" htmlType="submit">
          {user ? t('Update') : t('Create')}
        </Button>
        <Button type="dashed" onClick={onCancel}>
          {t('Cancel')}
        </Button>
      </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
