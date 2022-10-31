import { Heading, VStack } from '@chakra-ui/react';
import { Formiz } from '@formiz/core';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { Card, FieldInput, FieldRadio, FieldSlider } from '@/components';
import { db } from '@/db/prisma';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { FALSE, TRUE } from '@/utils/constants/global';

export const PageWineDetails = ({ wine }: { wine: any }) => {
    const router = useRouter();
    const { query } = router;

    const isReadOnly = !!query?.isReadOnly;

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                <Card flexDirection="column">
                    <Heading as="h2" size="sm">
                        {isReadOnly ? 'Details of your wine' : 'Edit a wine'}
                    </Heading>
                    <Formiz autoForm>
                        <VStack mt="4" spacing="4" alignItems="stretch">
                            <FieldInput
                                name="name"
                                label="Name"
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
                                name="isFavorite"
                                label="Is it one of your favorite ?"
                                as={VStack}
                                alignItems="flex-start"
                                colorScheme="primary"
                                options={[
                                    { value: TRUE, label: 'Yes' },
                                    { value: FALSE, label: 'No' },
                                ]}
                                defaultValue={wine.isFavorite ? TRUE : FALSE}
                                isDisabled={isReadOnly}
                            />
                        </VStack>
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
