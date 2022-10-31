import { Button, Heading, VStack } from '@chakra-ui/react';
import { Formiz } from '@formiz/core';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Card, FieldInput, FieldRadio, FieldSlider } from '@/components';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { useAddWine } from '@/services/wines';
import { FALSE, TRUE } from '@/utils/constants/global';
import { ROUTE_WINES } from '@/utils/constants/routes';

export const PageHome = () => {
    const { mutate } = useAddWine();

    const handleSubmit = (values: any) => {
        const { isFavorite, ...otherValues } = values;
        const wineToCreate = {
            ...otherValues,
            isFavorite: isFavorite === TRUE,
        };

        mutate(wineToCreate);
    };

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                <VStack spacing="4" px="4">
                    <Card justifyContent="center">
                        <Link href={ROUTE_WINES}>
                            <Button colorScheme="primary">Go to wines →</Button>
                        </Link>
                    </Card>
                    <Card flexDirection="column">
                        <Heading as="h2" size="sm">
                            Add a wine
                        </Heading>
                        <Formiz autoForm onSubmit={handleSubmit}>
                            <VStack mt="4" spacing="4" alignItems="stretch">
                                <FieldInput
                                    name="name"
                                    label="Name"
                                    required="The name is required"
                                />
                                <FieldInput
                                    type="textarea"
                                    name="description"
                                    label="Description"
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
                                    defaultValue={5}
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
                                    defaultValue={FALSE}
                                />

                                <Button type="submit" colorScheme="primary">
                                    Add
                                </Button>
                            </VStack>
                        </Formiz>
                    </Card>
                </VStack>
            </LayoutBody>
        </Layout>
    );
};

export default PageHome;
