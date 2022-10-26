import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { ROUTE_WINES } from '@/utils/constants/routes';

export const PageHome = () => {
    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                <Flex justifyContent="center">
                    <Link href={ROUTE_WINES}>
                        <Button colorScheme="primary">Go to wines →</Button>
                    </Link>
                </Flex>
            </LayoutBody>
        </Layout>
    );
};

export default PageHome;
