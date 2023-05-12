import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';
import { useTranslation } from 'next-i18next';

interface UserPasswordFormProps {
  visible: boolean;
  userid: string;
  onUpdate: (id: string) => void;
  onCancel: () => void;
}

const UserPasswordForm: React.FC<UserPasswordFormProps> = ({ visible, userid, onUpdate, onCancel }) => {
  const { t } = useTranslation("admin");
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onFinish = async (values: any) => {
    try {
      setConfirmLoading(true);
      const ruser = await fetch(`/api/users?PASSWORD=true&id=${userid}`, {
        method: 'PUT',
        body: JSON.stringify({ password: values.password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const ruserJson = await ruser.json();
      if (!ruserJson.error) {
        message.success(t('editSuccess'));
        onUpdate(userid);
        form.resetFields();
      } else {
        message.error(`${t('editFailed')}:${t(ruserJson.message || 'Unknown error')}`);
        return;
      }
      console.log('ruser:', ruser);

    } catch (error: any) {
      message.error(`${t('editFailed')}: ${t(error || 'Unknown error')}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={t('updateUserPassword')}
      onCancel={onCancel}
      footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
        <Form.Item>
          <Space direction="horizontal" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">
              {t('update')}
            </Button>
            <Button type="dashed" onClick={onCancel}>
              {t('cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default UserPasswordForm;
