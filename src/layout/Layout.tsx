import { PropsWithChildren } from 'react';

import { Box } from '@chakra-ui/react';

export const Layout: React.FC<PropsWithChildren> = (props) => {
    return <Box {...props} />;
};
