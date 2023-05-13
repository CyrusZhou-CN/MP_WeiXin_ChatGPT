import { Component } from 'react';
import Layout from '../components/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

class Error extends Component {
    static getInitialProps({ res, err }: any) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;
        const message = err ? err.message : '';
        const router = useRouter();
        const previousPageURL = router.query.from as string || '/';
        return { statusCode, message, previousPageURL };
    }

    render() {
        const { statusCode, message, previousPageURL }: any = this.props;
        // 获取上一个页面的 URL

        return (
            <Layout title="Error">
                <h1>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</h1>
                {message && <p>{message}</p>}
                <Link href={previousPageURL}>
                    Go Back
                </Link>
            </Layout>
        );
    }
}

export default Error;
