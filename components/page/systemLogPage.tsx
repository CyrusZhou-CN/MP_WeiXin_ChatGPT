import { useTranslation } from 'next-i18next';
import { Input, Table } from 'antd';
import { SystemLogModel } from 'db/models';
import { useEffect, useState } from 'react';

export default function SystemLogPage({ }) {
    const { t } = useTranslation('admin');
    const [systemLogData, setSystemLog] = useState<SystemLogModel[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [visible, setVisible] = useState(false);
    const columns = [
        {
            title: t('level'),
            dataIndex: 'level',
            key: 'level',
        },
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
            title: t('message'),
            dataIndex: 'message',
            key: 'message',
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
    ];
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };
    const filterUsers = async () => {
        const url = `/api/systemLog?search=${search}&page=${page}&limit=${pageSize}`;
        const response = await fetch(url);
        const { data, total } = await response.json();
        setTotal(total);
        setSystemLog(data);
    };
    useEffect(() => {
        filterUsers();
    }, [search, page, pageSize]);
    return (
        <>
            <h1>{t('systemLog')}</h1>
            <Input.Search
                value={search}
                onChange={handleSearch}
                placeholder={t('search') as string}
                style={{ paddingRight: 16, marginBottom: 16, maxWidth: 400 }} />
            <Table
                dataSource={systemLogData}
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
