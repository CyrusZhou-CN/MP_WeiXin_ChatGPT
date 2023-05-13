import { useEffect, useState } from 'react';
import { Button, Input, Space, Modal, Table, message } from 'antd';
import { ReplyCacheModel } from '../../db/models';
import { useTranslation } from 'next-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function ReplyCachePage({ }: any) {
    const { t } = useTranslation('admin');
    const [replyCache, setReplyCache] = useState<ReplyCacheModel[]>();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [visible, setVisible] = useState(false);
    const columns = [
        {
            title: t('fromUser'),
            dataIndex: 'fromusername',
            key: 'fromusername',
        },
        {
            title: t('toUser'),
            dataIndex: 'tousername',
            key: 'tousername',
        },
        {
            title: t('messageId'),
            dataIndex: 'msgId',
            key: 'msgId',
        },
        {
            title: t('responseId'),
            dataIndex: 'responseId',
            key: 'responseId',
        },
        {
            title: t('input'),
            dataIndex: 'input',
            key: 'input',
        },
        {
            title: t('reply'),
            dataIndex: 'reply',
            key: 'reply',
        },
        {
            title: t('ask'),
            dataIndex: 'ask',
            key: 'ask',
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
            title: t('expireAt'),
            dataIndex: 'expireAt',
            key: 'expireAt',
        },
        {
            title: '',
            key: 'action',
            render: (text: string, record: ReplyCacheModel) => (
                <Space size="middle">
                    <Button type="dashed" onClick={() => handleDelete(record)}>
                        {t('delete')}
                    </Button>
                </Space>
            ),
        },
    ];
    const handleDelete = (user: ReplyCacheModel) => {
        confirm({
            title: t('confirmDelete'),
            icon: <ExclamationCircleOutlined />,
            okText: t('yes'),
            okType: 'danger',
            cancelText: t('no'),
            onOk: async () => {
                try {
                    await fetch(`/api/replyCache?id=${user.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    message.success(t('deleteSuccess'));
                    filterUsers();
                } catch (error: any) {
                    message.error(`${t('deleteFailed')}: ${t(error || 'Unknown error')}`);
                }
            },
        });
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };
    const filterUsers = async () => {
        const url = `/api/replyCache?search=${search}&page=${page}&limit=${pageSize}`;
        const response = await fetch(url);
        const { data, total } = await response.json();
        setTotal(total);
        setReplyCache(data);
    };
    useEffect(() => {
        filterUsers();
    }, [search, page, pageSize]);
    return (
        <>
            <h1>{t('replyCache')}</h1>
            <Input.Search
                value={search}
                onChange={handleSearch}
                placeholder={t('search') as string}
                style={{ paddingRight: 16, marginBottom: 16, maxWidth: 400 }} />
            <Table
                dataSource={replyCache}
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
        </>
    );
}