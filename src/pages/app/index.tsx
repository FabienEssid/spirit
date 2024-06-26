import React from 'react';

import { Heading } from '@chakra-ui/react';
import { useForm } from '@formiz/core';
import { WineCharacteristic } from '@prisma/client';

import { Card, useToastError, useToastSuccess } from '@/components';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { WineForm } from '@/modules';
import { useAddWine } from '@/services/wines';
import { TRUE } from '@/utils/constants/global';

import { getWineCharacteristics } from '../api/wine-characteristics';

export const PageHome = ({
    wineCharacteristics,
}: {
    wineCharacteristics: WineCharacteristic[];
}) => {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();

    const form = useForm();

    const { mutate, isLoading } = useAddWine({
        onSuccess: () => {
            form.reset();
            toastSuccess({
                title: 'Wine added',
                description: 'Wine successfully added',
            });
        },
        onError: (error) => {
            toastError({
                title: 'Error',
                description: `An error occurred. Please try again later. The error is : ${
                    error?.response?.data || 'unknown'
                }`,
            });
        },
    });

    const handleValidSubmit = (values: any) => {
        const { isPinned, ...otherValues } = values;
        const wineToCreate = {
            ...otherValues,
            isPinned: isPinned === TRUE,
        };

        mutate(wineToCreate);
    };

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                <Card
                    flexDirection="column"
                    boxShadow={{ base: 'none', md: 'md' }}
                >
                    <Heading as="h2" size="sm">
                        Add a wine
                    </Heading>
                    <WineForm
                        connect={form}
                        isLoading={isLoading}
                        onValidSubmit={handleValidSubmit}
                        wineCharacteristics={wineCharacteristics}
                    />
                </Card>
            </LayoutBody>
        </Layout>
    );
};

export const getServerSideProps = async () => {
    const result = await getWineCharacteristics();
    return { props: { wineCharacteristics: result[1] } };
};

export default PageHome;
