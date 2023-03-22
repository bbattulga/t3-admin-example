import React from 'react'
import { useForm } from '@mantine/form';
import { Button, Loader, Select, TextInput } from '@mantine/core';
import { api } from '@/utils/api';

type Props = {
    onSuccess: () => void;
}

function CreateOrganizationForm({ ...props }: Props) {

    const createOrgMutation = api.superAdmin.createOrg.useMutation()

    const { onSubmit, values, ...form } = useForm({
        initialValues: {
            name: '',
            slug: '',
        },
    });

    const handleSubmit = async (d: typeof values) => {
        await createOrgMutation.mutateAsync({
            name: d.name,
            slug: d.slug,
        })
        props.onSuccess()
    }

    return (
        <form onSubmit={onSubmit(handleSubmit)}>
            <TextInput label="Name" {...form.getInputProps('name')} />
            <TextInput mt="md" label="Slug" {...form.getInputProps('slug')} />
            <Button type="submit" loading={createOrgMutation.isLoading} mt="md" fullWidth>Create Organization</Button>
        </form>
    )
}

export default CreateOrganizationForm