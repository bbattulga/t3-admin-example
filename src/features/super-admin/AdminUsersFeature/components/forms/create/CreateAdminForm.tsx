import React from 'react'
import { useForm } from '@mantine/form';
import { Button, Loader, Select, TextInput } from '@mantine/core';
import { api } from '@/utils/api';

type Props = {
    onSuccess: () => void;
}

function CreateAdminForm({ ...props }: Props) {

    const rolesData = api.superAdmin.roles.useQuery()
    const orgs = api.superAdmin.orgs.useQuery()
    const createAdminMutation = api.superAdmin.createAdmin.useMutation()

    const { onSubmit, values, ...form } = useForm({
        initialValues: {
            name: '',
            email: '',
            role: '',
            org: '',
        },
    });

    const handleSubmit = async (d: typeof values) => {
        await createAdminMutation.mutateAsync({
            name: d.name,
            email: d.email,
            role: parseInt(d.role),
            org: parseInt(d.org) || undefined
        })
        props.onSuccess()
    }

    return (
        <form onSubmit={onSubmit(handleSubmit)}>
            <TextInput label="Name" {...form.getInputProps('name')} />
            <TextInput mt="md" label="Email" {...form.getInputProps('email')} />
            {rolesData.isFetching ? (<Loader mt="md" />) : (<></>)}
            {rolesData.isFetched && rolesData.data?.records ? (
                <Select mt="md" label="Role" onChange={(v) => {
                    if (v) {
                        form.setFieldValue('role', v)
                    }
                }} data={rolesData.data.records.map((role) => ({
                    value: role.role_id.toString(),
                    label: role.name
                }))} />
            ) : (<></>)}
            {orgs.isFetching ? (<Loader mt="md" />) : (<></>)}
            {orgs.isFetched && orgs.data?.records ? (
                <Select mt="md" label="Organization" onChange={(v) => {
                    if (v) {
                        form.setFieldValue('org', v)
                    }
                }} data={orgs.data.records.map((role) => ({
                    value: role.org_id.toString(),
                    label: role.name
                }))} />
            ) : (<></>)}
            <Button type="submit" loading={createAdminMutation.isLoading} mt="md" fullWidth>Create Admin</Button>
        </form>
    )
}

export default CreateAdminForm