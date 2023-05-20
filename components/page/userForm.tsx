import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';
import { useTranslation } from 'next-i18next';

interface UserFormProps {
  visible: boolean;
  user?: any;
  onCreate: (values: any) => void;
  onUpdate: (id: string, values: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ visible, user, onCreate, onUpdate, onCancel }) => {
  const { t } = useTranslation("admin");
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    try {
      setConfirmLoading(true);
      if (user) {
        const ruser = await fetch(`/api/users?id=${user.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const ruserJson = await ruser.json();
        if (!ruserJson.error) {
          message.success(t('editSuccess'));
          onUpdate(user.id, ruserJson);
        } else {
          message.error(`${t('editFailed')}:${t(ruserJson.message || 'Unknown error')}`);
          return;
        }
        console.log('ruser:', ruser);
      } else {
        const ruser = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const ruserJson = await ruser.json();
        if (!ruserJson.error) {
          message.success(t('createSuccess'));
          console.log('ruser:', ruserJson);
          onCreate(ruserJson);
        } else {
          message.error(`${t('createFailed')}:${t(ruserJson.message || 'Unknown error')}`);
          return;
        }
      }
      form.resetFields();
    } catch (error: any) {      
      console.log('error:', error);
      message.error(`${t('createFailed')}: ${t(error || 'Unknown error')}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={user ? t('updateUser') : t('createUser')}
      onCancel={onCancel}
      footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label={t('name')} rules={[{ required: true, message: t('pleaseInputName') as string }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label={t('username')} rules={[{ required: true, message: t('pleaseInputUserName') as string }]}>
          <Input disabled={user ? true : false} />
        </Form.Item>
        {user ? null : (
          <>
            <Form.Item
              name="password"
              label={t('password')}
              rules={[{ required: true, message: t('pleaseInputPassword') as string }]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={t('confirmPassword')}
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: t('pleaseConfirmPassword') as string,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t('passwordsDoNotMatch') as string)
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}
        <Form.Item name="email" label={t('email')} rules={[{ required: true, message: t('pleaseInputEmail') as string }]}>
          <Input />
        </Form.Item>
        <Form.Item name="emailVerified" label={t('emailVerified')}>
          <Input readOnly />
        </Form.Item>
        <Form.Item>
          <Space direction="horizontal" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">
              {user ? t('update') : t('create')}
            </Button>
            <Button type="dashed" onClick={onCancel}>
              {t('cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;

