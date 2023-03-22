import React from 'react'
import { useForm } from '@mantine/form';
import { Button, Checkbox, Loader, Select, TextInput } from '@mantine/core';
import { api } from '@/utils/api';
import { showNotification } from '@mantine/notifications'

type Props = {
    roleId: number;
    initialValues: {
        name: string;
        slug: string;
        isSuper: boolean;
    },
    onSuccess: () => void
}

function UpdateRoleForm({ ...props }: Props) {

    const updateRoleMutation = api.superAdmin.updateRole.useMutation()

    const { onSubmit, values, ...form } = useForm({
        initialValues: props.initialValues,
    });

    const handleSubmit = async (d: typeof values) => {
        await updateRoleMutation.mutateAsync({
            roleId: props.roleId,
            name: d.name,
            slug: d.slug,
            isSuper: d.isSuper,
        })
        showNotification({
            message: 'Role Updated Successfully',
            color: 'green',
        })
        props.onSuccess()
    }

    return (
        <form onSubmit={onSubmit(handleSubmit)}>
            <TextInput label="Name" autoFocus {...form.getInputProps('name')} />
            <TextInput mt="md" label="Slug" {...form.getInputProps('slug')} />
            <Checkbox mt="md" label="Is Super?" {...form.getInputProps('isSuper')} />
            <Button type="submit" loading={updateRoleMutation.isLoading} mt="md" fullWidth>Update Role</Button>
        </form>
    )
}

export default UpdateRoleForm