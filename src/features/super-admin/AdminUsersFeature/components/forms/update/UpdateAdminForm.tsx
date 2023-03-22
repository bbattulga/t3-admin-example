import React from 'react'
import { useForm } from '@mantine/form';
import { Button, Loader, Select, TextInput } from '@mantine/core';
import { api } from '@/utils/api';

type Props = {
    adminId: number;
    initialValues: {
        name: string;
        email: string;
        role: string;
        org?: string;
    };
    onSuccess: () => void;
}

function UpdateAdminForm({ ...props }: Props) {

    const rolesData = api.superAdmin.roles.useQuery()
    const orgs = api.superAdmin.orgs.useQuery()
    const updateAdminMutation = api.superAdmin.updateAdmin.useMutation()

    const { onSubmit, values, ...form } = useForm({
        initialValues: props.initialValues,
    });

    const handleSubmit = async (d: typeof values) => {
        await updateAdminMutation.mutateAsync({
            adminId: props.adminId,
            name: d.name,
            email: d.email,
            role: parseInt(d.role),
            org: d.org ? parseInt(d.org) : undefined
        })
        props.onSuccess()
    }

    return (
        <form onSubmit={onSubmit(handleSubmit)}>
            <TextInput label="Name" {...form.getInputProps('name')} />
            <TextInput mt="md" label="Email" {...form.getInputProps('email')} />
            {rolesData.isFetching ? (<Loader />) : (<></>)}
            {rolesData.isFetched && rolesData.data?.records ? (
                <Select mt="md" label="Role" value={form.getInputProps('role').value?.toString()} onChange={(v) => {
                    if (v) {
                        form.setFieldValue('role', v)
                    }
                }} data={rolesData.data.records.map((role) => ({
                    value: role.role_id.toString(),
                    label: role.name
                }))} />
            ) : (<></>)}
            {orgs.isFetching ? (<Loader />) : (<></>)}
            {orgs.isFetched && orgs.data?.records ? (
                <Select mt="md" label="Organization" value={form.getInputProps('org').value?.toString()} onChange={(v) => {
                    if (v) {
                        form.setFieldValue('org', v)
                    }
                }} data={orgs.data.records.map((org) => ({
                    value: org.org_id.toString(),
                    label: org.name
                }))} />
            ) : (<></>)}
            <Button type="submit" loading={updateAdminMutation.isLoading} mt="md" fullWidth>Update Admin</Button>
        </form>
    )
}

export default UpdateAdminForm