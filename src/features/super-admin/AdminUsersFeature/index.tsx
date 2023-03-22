import { api } from '@/utils/api'
import { ActionIcon, Button, Center, Flex, Group, Loader, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import moment from 'moment'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import CreateAdminForm from './components/forms/create/CreateAdminForm'
import { DataTable } from 'mantine-datatable'
import { modals } from '@mantine/modals'
import UpdateAdminForm from './components/forms/update/UpdateAdminForm'

type Props = {}

function AdminUsersFeature({ }: Props) {

    const adminUsers = api.superAdmin.adminUsers.useQuery({
        offset: 0,
        limit: 1000
    })

    return (
        <>
            <div>
                <Flex sx={{ width: '100%' }} justify="space-between">
                    <Title mb="lg">Admin Users</Title>
                    <Button onClick={() => {
                        modals.open({
                            title: 'Create Admin',
                            centered: true,
                            children: (
                                <>
                                    <CreateAdminForm onSuccess={() => {
                                        adminUsers.refetch()
                                        modals.closeAll()
                                    }} />
                                </>
                            )
                        })
                    }}>Create Admin</Button>
                </Flex>
                {adminUsers.isFetching ? (
                    <Loader mb="md" />
                ) : (<></>)}
                {adminUsers.data?.records?.length ? (
                    <DataTable
                        withBorder
                        borderRadius="sm"
                        withColumnBorders
                        striped
                        columns={[
                            {
                                accessor: 'admin_id',
                                title: 'Admin ID'
                            },
                            {
                                accessor: 'name',
                                title: 'Name'
                            },
                            {
                                accessor: 'email',
                                title: 'Email'
                            },
                            {
                                accessor: 'role',
                                render: (v) => <p>{v.role?.name}</p>,
                                title: 'Role'
                            },
                            {
                                accessor: 'org',
                                render: (v) => <p>{v.org?.name}</p>,
                                title: 'Organization'
                            },
                            {
                                accessor: 'created_at',
                                title: 'Created At',
                                render: (v) => <p>{moment(v.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                            },
                            {
                                accessor: 'updated_at',
                                title: 'Updated At',
                                render: (v) => <p>{moment(v.updated_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (val) => (
                                    <Group spacing={4} position="right" noWrap>
                                        <ActionIcon color="blue" onClick={() => {
                                            modals.open({
                                                title: 'Update Admin User',
                                                centered: true,
                                                children: (
                                                    <>
                                                        <UpdateAdminForm adminId={val.admin_id} initialValues={{
                                                            ...val,
                                                            role: val.role?.role_id ? val.role.role_id.toString() : '',
                                                            org: val.org?.org_id ? val.org.org_id.toString() : '',
                                                        }} onSuccess={() => {
                                                            adminUsers.refetch()
                                                            modals.closeAll()
                                                        }} />
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
                                                                    <Text mb="md">Deleting admin {val.email}...</Text>
                                                                    <Loader />
                                                                </Stack>
                                                            </Center>
                                                        )
                                                    })

                                                    modals.closeAll()
                                                },
                                                children: (
                                                    <>
                                                        <p>Are you sure want to delete admin {val.email}?</p>
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
                        records={adminUsers.data.records} />
                ) : (<></>)}
            </div>
        </>
    )
}

export default AdminUsersFeature