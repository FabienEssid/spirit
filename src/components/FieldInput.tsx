import { useField } from '@formiz/core';

export const FieldInput = (props: any) => {
    const { value, setValue } = useField(props);

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
        <div className="mt-1">
            <input
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleChange}
                value={value || ''}
                {...props}
            />
        </div>
    );
};
