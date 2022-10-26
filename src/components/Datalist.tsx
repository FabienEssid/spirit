import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { PropsWithChildren } from 'react';

import { Box, Flex, Heading, HeadingProps } from '@chakra-ui/react';

import { Card, CardType } from './Card';

type ColumnType = {
    name: string;
    size: number;
};

type ColumnsType = ColumnType[];

type DatalistContextType = {
    columns: ColumnsType;
    setColumns: Dispatch<SetStateAction<ColumnsType>>;
};

export const DatalistContext = React.createContext<DatalistContextType>({
    columns: [],
    setColumns: () => {},
});
export const useDatalistContext = () => React.useContext(DatalistContext);

export const Datalist: React.FC<CardType> = (props) => {
    const [columns, setColumns] = React.useState<
        { name: string; size: number }[]
    >([]);

    return (
        <DatalistContext.Provider value={{ columns, setColumns }}>
            <Card p="0" {...props} />
        </DatalistContext.Provider>
    );
};

export type DatalistHeaderType = {
    title?: String;
    titleProps?: HeadingProps;
};

export const DatalistHeader: React.FC<DatalistHeaderType> = ({
    title,
    titleProps,
    ...props
}) => {
    return (
        <Box px="4" pt="4" {...props}>
            {title ? (
                <Heading as="h3" size="sm" {...titleProps}>
                    {title}
                </Heading>
            ) : null}
        </Box>
    );
};

export const DatalistBody: React.FC<PropsWithChildren> = (props) => {
    return <Box {...props} pt="4" />;
};

export const DatalistRowHeader: React.FC<PropsWithChildren> = (props) => {
    return <Flex {...props} />;
};

export type DatalistColumnNameType = {
    name: string;
    size?: number;
};

export const DatalistColumnName: React.FC<
    DatalistColumnNameType & PropsWithChildren
> = ({ size = 1, name, ...props }) => {
    const { columns, setColumns } = useDatalistContext();

    useEffect(() => {
        const index = columns.findIndex((column) => column.name === name);
        if (index === -1) {
            setColumns((prevColumns) => [...prevColumns, { size, name }]);
        } else if (columns[index].size !== size) {
            const newColumns = [...columns];
            newColumns.splice(index, 1);
            setColumns([...newColumns, { size, name }]);
        }
    }, [columns, setColumns, size, name]);

    return (
        <Box
            backgroundColor="gray.100"
            px="4"
            py="2"
            flexGrow={size}
            {...props}
        />
    );
};

export const DatalistRow: React.FC<PropsWithChildren> = (props) => {
    return <Flex {...props} />;
};

export type DatalistColumnType = {
    name: string;
};

export const DatalistColumn: React.FC<
    DatalistColumnType & PropsWithChildren
> = ({ name, ...props }) => {
    const [size, setSize] = React.useState(1);
    const { columns } = useDatalistContext();

    useEffect(() => {
        const index = columns.findIndex((column) => column.name === name);
        if (index !== -1) {
            setSize(columns[index].size);
        }
    }, [name, columns]);

    return <Box px="4" py="2" flexGrow={size} {...props} />;
};
