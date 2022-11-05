import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    IconButton,
    VStack,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { GetServerSidePropsContext } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import {
    Card,
    FieldInput,
    FieldRadio,
    FieldSlider,
    Loading,
    useToastError,
    useToastSuccess,
} from '@/components';
import { db } from '@/db/prisma';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { useUpdateWine } from '@/services/wines';
import { FALSE, TRUE } from '@/utils/constants/global';
import { ROUTE_WINES } from '@/utils/constants/routes';

export const PageWineDetails = ({ wine }: { wine: any }) => {
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

    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

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
                    <Formiz
                        connect={form}
                        autoForm
                        onValidSubmit={handleValidSubmit}
                    >
                        <VStack mt="4" spacing="4" alignItems="stretch">
                            <FieldInput
                                name="name"
                                label="Name"
                                required="The name is required"
                                defaultValue={wine.name}
                                isDisabled={isReadOnly}
                            />
                            <FieldInput
                                type="textarea"
                                name="description"
                                label="Description"
                                defaultValue={wine.description}
                                isDisabled={isReadOnly}
                            />
                            <FieldSlider
                                name="rating"
                                label="Rating"
                                min={0}
                                max={10}
                                step={1}
                                colorScheme="primary"
                                mb="4"
                                sliderMarksProps={{
                                    top: '0.75em',
                                }}
                                sliderMarks={[
                                    { value: 0, label: '0' },
                                    { value: 1, label: '1' },
                                    { value: 2, label: '2' },
                                    { value: 3, label: '3' },
                                    { value: 4, label: '4' },
                                    { value: 5, label: '5' },
                                    { value: 6, label: '6' },
                                    { value: 7, label: '7' },
                                    { value: 8, label: '8' },
                                    { value: 9, label: '9' },
                                    { value: 10, label: '10' },
                                ]}
                                defaultValue={wine.rating}
                                isDisabled={isReadOnly}
                            />
                            <FieldRadio
                                name="isPinned"
                                label="Do you want to pin this wine ?"
                                as={VStack}
                                alignItems="flex-start"
                                colorScheme="primary"
                                options={[
                                    { value: TRUE, label: 'Yes' },
                                    { value: FALSE, label: 'No' },
                                ]}
                                defaultValue={wine.isPinned ? TRUE : FALSE}
                                isDisabled={isReadOnly}
                            />
                        </VStack>
                        {!isReadOnly && (
                            <Box
                                position="fixed"
                                zIndex="docked"
                                bottom="0"
                                left="0"
                                right="0"
                                p="4"
                                boxShadow="xs"
                            >
                                <Button
                                    type="submit"
                                    colorScheme="primary"
                                    isDisabled={shouldDisableSubmitButton}
                                    width="full"
                                >
                                    {isLoading && <Loading size="sm" mr="2" />}
                                    Update
                                </Button>
                            </Box>
                        )}
                    </Formiz>
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
    });
    const wine = result || undefined;

    if (!wine) return { props: { wine: null } };

    return { props: { wine } };
};

export default PageWineDetails;
