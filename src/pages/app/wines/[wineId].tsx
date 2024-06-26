import { Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { useForm } from '@formiz/core';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Wine, WineCharacteristic } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Card, useToastError, useToastSuccess } from '@/components';
import { db } from '@/db/prisma';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { WineForm } from '@/modules';
import { getWineCharacteristics } from '@/pages/api/wine-characteristics';
import { useUpdateWine } from '@/services/wines';
import { TRUE } from '@/utils/constants/global';
import { ROUTE_WINES } from '@/utils/constants/routes';

export const PageWineDetails = ({
    wine,
    wineCharacteristics,
}: {
    wine: Wine;
    wineCharacteristics: WineCharacteristic[];
}) => {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();
    const form = useForm();
    const router = useRouter();
    const { query } = router;

    const isReadOnly = !!query?.isReadOnly;

    const { mutate, isLoading } = useUpdateWine(wine.id, {
        onSuccess: () => {
            form.reset();
            toastSuccess({
                title: 'Wine updated',
                description: 'Wine successfully updated',
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
        const wineToUpdate = {
            ...otherValues,
            isPinned: isPinned === TRUE,
        };

        mutate(wineToUpdate);
    };

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                <Card
                    flexDirection="column"
                    boxShadow={{ base: 'none', md: 'md' }}
                >
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading as="h2" size="sm">
                            {isReadOnly
                                ? 'Details of your wine'
                                : 'Edit a wine'}
                        </Heading>
                        {isReadOnly && (
                            <NextLink
                                passHref
                                href={`${ROUTE_WINES}/${wine.id}`}
                            >
                                <IconButton
                                    icon={<Icon as={PencilSquareIcon} />}
                                    aria-label="Update"
                                    size="sm"
                                    colorScheme="primary"
                                />
                            </NextLink>
                        )}
                    </Flex>
                    <WineForm
                        connect={form}
                        isUpdateMode
                        isLoading={isLoading}
                        isReadOnly={isReadOnly}
                        initialValues={wine}
                        wineCharacteristics={wineCharacteristics}
                        onValidSubmit={handleValidSubmit}
                    />
                </Card>
            </LayoutBody>
        </Layout>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext<{ wineId: string }>
) => {
    const { wineId } = context.params || { wineId: undefined };
    const result = await db.wine.findFirst({
        where: {
            id: wineId,
        },
        include: {
            medias: {
                select: {
                    id: true,
                },
            },
            wineCharacteristics: {
                select: {
                    wineCharacteristic: true,
                },
            },
        },
    });

    const medias = result?.medias.map((media) => media.id);
    const wineCharacteristics = result?.wineCharacteristics.map(
        (wineCharacteristicOnWine) =>
            wineCharacteristicOnWine.wineCharacteristic.id
    );
    const wine = { ...result, medias, wineCharacteristics } || undefined;

    const allWineCharacteristics = await getWineCharacteristics();

    return {
        props: {
            wine: wine || null,
            wineCharacteristics: allWineCharacteristics?.[1] || [],
        },
    };
};

export default PageWineDetails;
