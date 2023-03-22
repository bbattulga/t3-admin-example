import React from 'react'
import { useForm } from '@mantine/form';
import { Button, Loader, Select, TextInput } from '@mantine/core';
import { api } from '@/utils/api';

type Props = {
    orgId: number;
    onSuccess: () => void;
}

function UpdateOrganizationForm({ ...props }: Props) {

    const updateOrgMutation = api.superAdmin.updateOrg.useMutation()

    const { onSubmit, values, ...form } = useForm({
        initialValues: {
            name: '',
            slug: '',
        },
    });

    const handleSubmit = async (d: typeof values) => {
        await updateOrgMutation.mutateAsync({
            orgId: props.orgId,
            name: d.name,
            slug: d.slug,
        })
        props.onSuccess()
    }

    return (
        <form onSubmit={onSubmit(handleSubmit)}>
            <TextInput label="Name" {...form.getInputProps('name')} />
            <TextInput mt="md" label="Slug" {...form.getInputProps('slug')} />
            <Button type="submit" loading={updateOrgMutation.isLoading} mt="md" fullWidth>Update Organization</Button>
        </form>
    )
}

export default UpdateOrganizationForm