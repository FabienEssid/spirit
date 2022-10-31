import React from 'react';

import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Heading,
    Icon,
    LinkBox,
    LinkOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import NextLink from 'next/link';

import { Loading } from '@/components';
import {
    DataList as StartUIDataList,
    DataListCell as StartUIDataListCell,
    DataListFooter as StartUIDataListFooter,
    DataListHeader as StartUIDataListHeader,
    DataListRow as StartUIDataListRow,
} from '@/components/_StartUIDataList';
import {
    Pagination as StartUIPagination,
    PaginationButtonFirstPage as StartUIPaginationButtonFirstPage,
    PaginationButtonLastPage as StartUIPaginationButtonLastPage,
    PaginationButtonNextPage as StartUIPaginationButtonNextPage,
    PaginationButtonPrevPage as StartUIPaginationButtonPrevPage,
    PaginationInfo as StartUIPaginationInfo,
} from '@/components/_StartUIPagination';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { useGetWines } from '@/services/wines';
import { ROUTE_WINES } from '@/utils/constants/routes';
import { PAGE_SIZE } from '@/utils/constants/wine';

export const PageWines = () => {
    const [page, setPage] = React.useState(1);

    const { wines, totalItems, isFetching } = useGetWines({
        page,
        pageSize: PAGE_SIZE,
    });

    const isOnResponsiveMode = useBreakpointValue({ base: true, md: false });

    const numberOfPages = Math.floor(totalItems / PAGE_SIZE);

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody px={{ base: 4, lg: 8 }}>
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading as="h2" size="md">
                        Wines
                    </Heading>
                    {isOnResponsiveMode ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<Icon as={ChevronDownIcon} />}
                            >
                                {!page ? `Select page` : `Page ${page}`}
                            </MenuButton>
                            <MenuList>
                                {Array.apply(
                                    null,
                                    Array(
                                        numberOfPages === 0 ? 1 : numberOfPages
                                    )
                                ).map((_, index) => (
                                    <MenuItem
                                        key={`page-${index + 1}`}
                                        onClick={() => setPage(index + 1)}
                                    >{`Page ${index + 1}`}</MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    ) : null}
                </Flex>
                <StartUIDataList mt="4">
                    <StartUIDataListHeader
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {isOnResponsiveMode ? (
                            <StartUIDataListCell colName="wine"></StartUIDataListCell>
                        ) : (
                            <>
                                <StartUIDataListCell
                                    colName="image"
                                    colWidth="0.25"
                                />
                                <StartUIDataListCell colName="name">
                                    Name
                                </StartUIDataListCell>
                                <StartUIDataListCell colName="description">
                                    Description
                                </StartUIDataListCell>
                                <StartUIDataListCell
                                    colName="rating"
                                    colWidth="0.25"
                                    alignItems="flex-end"
                                >
                                    Rating
                                </StartUIDataListCell>
                            </>
                        )}
                    </StartUIDataListHeader>
                    {isFetching ? (
                        <Loading variant="full" containerProps={{ flex: 1 }} />
                    ) : (
                        (wines || []).map((wine) => (
                            <Box key={wine.id}>
                                {isOnResponsiveMode ? (
                                    <StartUIDataListRow as={LinkBox}>
                                        <StartUIDataListCell colName="wine">
                                            <NextLink
                                                href={`${ROUTE_WINES}/${wine.id}?isReadOnly=true`}
                                                passHref
                                            >
                                                <LinkOverlay>
                                                    <HStack
                                                        spacing={2}
                                                        alignItems="center"
                                                    >
                                                        <Avatar
                                                            size="sm"
                                                            src={
                                                                wine.medias?.[0]
                                                                    ?.media?.url
                                                            }
                                                            name={wine.name}
                                                        />
                                                        <Text
                                                            noOfLines={1}
                                                            lineHeight="1"
                                                            fontSize="sm"
                                                        >
                                                            {wine.name}
                                                        </Text>
                                                    </HStack>
                                                    <Text
                                                        ml="10"
                                                        noOfLines={2}
                                                        fontSize="xs"
                                                    >
                                                        {wine.description}
                                                    </Text>
                                                </LinkOverlay>
                                            </NextLink>
                                        </StartUIDataListCell>
                                    </StartUIDataListRow>
                                ) : (
                                    <StartUIDataListRow as={LinkBox}>
                                        <StartUIDataListCell colName="image">
                                            <Avatar
                                                src={
                                                    wine.medias?.[0]?.media?.url
                                                }
                                                name={wine.name}
                                            />
                                        </StartUIDataListCell>
                                        <StartUIDataListCell colName="name">
                                            <Box minWidth="0">
                                                <Text
                                                    noOfLines={2}
                                                    fontWeight={{
                                                        base: '600',
                                                        md: '400',
                                                    }}
                                                >
                                                    <NextLink
                                                        href={`${ROUTE_WINES}/${wine.id}?isReadOnly=true`}
                                                        passHref
                                                    >
                                                        <LinkOverlay>
                                                            {wine.name}
                                                        </LinkOverlay>
                                                    </NextLink>
                                                </Text>
                                            </Box>
                                        </StartUIDataListCell>
                                        <StartUIDataListCell colName="description">
                                            <Text noOfLines={2}>
                                                {wine.description}
                                            </Text>
                                        </StartUIDataListCell>
                                        <StartUIDataListCell
                                            colName="rating"
                                            alignItems="flex-end"
                                        >
                                            {wine.rating}/10
                                        </StartUIDataListCell>
                                    </StartUIDataListRow>
                                )}
                            </Box>
                        ))
                    )}
                    {!isOnResponsiveMode ? (
                        <StartUIDataListFooter>
                            <StartUIPagination
                                isLoadingPage={false}
                                setPage={setPage}
                                page={page}
                                pageSize={PAGE_SIZE}
                                totalItems={totalItems}
                            >
                                <StartUIPaginationButtonFirstPage />
                                <StartUIPaginationButtonPrevPage />
                                <StartUIPaginationInfo flex="1" />
                                <StartUIPaginationButtonNextPage />
                                <StartUIPaginationButtonLastPage />
                            </StartUIPagination>
                        </StartUIDataListFooter>
                    ) : null}
                </StartUIDataList>
            </LayoutBody>
        </Layout>
    );
};

export default PageWines;
