import { api } from '@/utils/api'
import { ActionIcon, Button, Center, Container, Flex, Group, Loader, Modal, Stack, Text, Title } from '@mantine/core'
import React, { useEffect } from 'react'
import moment from 'moment'
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import CreateRoleForm from './components/forms/create/CreateRoleForm'
import UpdateRoleForm from './components/forms/update/UpdateRoleForm'
import { DataTable } from 'mantine-datatable';

type Props = {}

function SuperAdminRolesFeature({ }: Props) {

    const roles = api.superAdmin.roles.useQuery()
    const deleteRoleMutation = api.superAdmin.deleteRole.useMutation()
    const [createRoleOpened, { open: openCreateRole, close: closeCreateRole }] = useDisclosure()

    return (
        <>
            <div>
                <Flex sx={{ width: '100%' }} justify="space-between">
                    <Title mb="lg">Roles</Title>
                    <Button onClick={openCreateRole}>Create Role</Button>
                </Flex>
                {roles.isLoading ? (
                    <Center>
                        <Loader />
                    </Center>
                ) : (<></>)}
                {roles.data?.records?.length ? (
                    <>
                        <DataTable
                            withBorder
                            borderRadius="sm"
                            withColumnBorders
                            striped
                            columns={[
                                {
                                    accessor: 'role_id',
                                    title: 'Role ID'
                                },
                                {
                                    accessor: 'name',
                                    title: 'Name'
                                },
                                {
                                    accessor: 'slug',
                                    title: 'Slug'
                                },
                                {
                                    accessor: 'created_at',
                                    title: 'Created At',
                                    render: (v) => <p>{moment(v.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                                },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (val) => (
                                        <Group spacing={4} position="right" noWrap>
                                            <ActionIcon color="blue" onClick={() => {
                                                modals.open({
                                                    title: 'Update Role',
                                                    centered: true,
                                                    children: (
                                                        <>
                                                            <UpdateRoleForm initialValues={{
                                                                name: val.name,
                                                                slug: val.slug,
                                                                isSuper: val.is_super,
                                                            }} onSuccess={() => {
                                                                roles.refetch()
                                                                modals.closeAll()
                                                            }} roleId={val.role_id} />
                                                        </>
                                                    )
                                                })
                                            }}>
                                                <IconEdit size={20} />
                                            </ActionIcon>
                                            <ActionIcon color="red" onClick={() => {
                                                modals.openConfirmModal({
                                                    title: <Text size="lg">Please confirm your action</Text>,
                                                    centered: true,
                                                    labels: ({ confirm: 'Confirm', cancel: 'Cancel' }),
                                                    closeOnConfirm: false,
                                                    onConfirm: async () => {
                                                        modals.open({
                                                            centered: true,
                                                            closeOnEscape: false,
                                                            closeOnClickOutside: false,
                                                            withCloseButton: false,
                                                            children: (
                                                                <Center>
                                                                    <Stack align="center">
                                                                        <Text mb="md">Deleting role {val.slug}...</Text>
                                                                        <Loader />
                                                                    </Stack>
                                                                </Center>
                                                            )
                                                        })
                                                        await deleteRoleMutation.mutateAsync({
                                                            id: val.role_id
                                                        })
                                                        await roles.refetch()
                                                        modals.closeAll()
                                                    },
                                                    children: (
                                                        <>
                                                            <p>Are you sure want to delete role {val.name}?</p>
                                                        </>
                                                    )
                                                })
                                            }}>
                                                <IconTrash size={20} />
                                            </ActionIcon>
                                        </Group>
                                    )
                                }
                            ]}
                            records={roles.data.records}
                        />
                    </>
                ) : (<></>)}
            </div>
            <Modal opened={createRoleOpened} onClose={closeCreateRole} title="Create Role" centered>
                <CreateRoleForm onSuccess={() => {
                    roles.refetch()
                    closeCreateRole()
                }} />
            </Modal>
        </>
    )
}

export default SuperAdminRolesFeature