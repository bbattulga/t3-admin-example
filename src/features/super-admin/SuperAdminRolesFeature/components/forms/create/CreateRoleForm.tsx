import React from 'react'
import { useForm } from '@mantine/form';
import { Button, Checkbox, Loader, Select, TextInput } from '@mantine/core';
import { api } from '@/utils/api';
import { showNotification } from '@mantine/notifications'

type Props = {
    onSuccess: () => void
}

function CreateRoleForm({ ...props }: Props) {

    const createRoleMutation = api.superAdmin.createRole.useMutation()

    const { onSubmit, values, ...form } = useForm({
        initialValues: {
            name: '',
            slug: '',
            isSuper: false,
        },
    });

    const handleSubmit = async (d: typeof values) => {
        await createRoleMutation.mutateAsync({
            name: d.name,
            slug: d.slug,
            isSuper: d.isSuper,
        })
        showNotification({
            message: 'Role Create Successfully',
            color: 'green',
        })
        props.onSuccess()
    }

    return (
        <form onSubmit={onSubmit(handleSubmit)}>
            <TextInput label="Name" autoFocus {...form.getInputProps('name')} />
            <TextInput mt="md" label="Slug" defaultValue={"super-admin"} {...form.getInputProps('slug')} />
            <Checkbox mt="md" label="Is Super Admin?" {...form.getInputProps('isSuper')} />
            <Button type="submit" loading={createRoleMutation.isLoading} mt="md" fullWidth>Create Admin</Button>
        </form>
    )
}

export default CreateRoleForm