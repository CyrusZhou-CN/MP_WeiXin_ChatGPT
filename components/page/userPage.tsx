import { useEffect, useState, useCallback } from 'react';
import { Table, Input, Modal, message, Button, Space } from 'antd';
import { User } from '../../db/models';
import { useTranslation } from 'next-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from './userForm';
import UserPasswordForm from './userPasswordForm';
const { confirm } = Modal;
const UserPage = ({ }: any) => {
    const { t } = useTranslation('admin');
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [userid, setUserId] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [user, setUser] = useState<User>();
    const columns = [
        {
            title: t('image'),
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('username'),
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: t('email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('emailVerified'),
            dataIndex: 'emailVerified',
            key: 'emailVerified',
        },
        {
            title: t('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: t('updatedAt'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: '',
            key: 'action',
            render: (text: string, record: User) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        {t('edit')}
                    </Button>
                    <Button type="primary" onClick={() => handleUpdatePassword(record)}>
                        {t('updatePassword')}
                    </Button>
                    <Button type="dashed" onClick={() => handleDelete(record)}>
                        {t('delete')}
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleCreate = async (user: User) => {
        try {
            filterUsers();
        } catch (error: any) {
            message.error(`${t('createFailed')}: ${t(error || 'Unknown error')}`);
        } finally {
            setVisible(false);
        }
    };
    const showModal = () => {
        setUser(undefined)
        setVisible(true);
    }
    const handleHideModal = () => {
        setVisible(false);
    };
    const handleEdit = async (user: User) => {
        setUser(user);
        setVisible(true);
    };
    const handleUpdatePassword = async (user: User) => {
        setUserId(user.id);
        setPasswordVisible(true);
    }
    const onUpdate = async (id: string, values: User) => {
        try {
            filterUsers();
        } catch (error: any) {
            message.error(`${t('editFailed')}: ${t(error || 'Unknown error')}`);
        } finally {
            setVisible(false);
        }
    }
    const onUpdatePassword = async (id: string) => {
        setPasswordVisible(false);
    }
    const handleDelete = (user: User) => {
        setConfirmLoading(true);
        confirm({
            title: t('confirmDelete'),
            icon: <ExclamationCircleOutlined />,
            okText: t('yes'),
            okType: 'danger',
            cancelText: t('no'),
            onOk: async () => {
                try {
                    await fetch(`/api/users?id=${user.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    message.success(t('deleteSuccess'));
                    filterUsers();
                } catch (error: any) {
                    message.error(`${t('deleteFailed')}: ${t(error || 'Unknown error')}`);
                } finally {
                    setConfirmLoading(false);
                }
            },
        });
    }
    const filterUsers = useCallback(async () => {
        setConfirmLoading(true);
        const url = `/api/users?search=${search}&page=${page}&limit=${pageSize}`;
        const response = await fetch(url);
        const { data, total } = await response.json();
        setTotal(total);
        setUsers(data);
        setConfirmLoading(false);
    }, [search, page, pageSize]);
    useEffect(() => {
        setConfirmLoading(true);
        filterUsers();
        setConfirmLoading(false);
    }, [search, page, pageSize, filterUsers]);

    return (
        <><h1>{t('users')}</h1>
            <Input.Search
                value={search}
                onChange={handleSearch}
                placeholder={t('search') as string}
                style={{ paddingRight: 16, marginBottom: 16, maxWidth: 400 }} />
            <Button style={{ float: 'right', paddingRight: 16, marginBottom: 16 }}
                type="primary"
                onClick={showModal}
                title={t('createUser') as string} >{t('createUser')}</Button>
            <Table
                dataSource={users}
                columns={columns}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize ?? 10);
                    },
                }} />
            <UserForm visible={visible}
                onCreate={handleCreate}
                onUpdate={onUpdate}
                onCancel={handleHideModal}
                user={user} />
            <UserPasswordForm visible={passwordVisible}
                onCancel={() => setPasswordVisible(false)}
                userid={userid} onUpdate={onUpdatePassword} />
        </>
    );
}

export default UserPage;