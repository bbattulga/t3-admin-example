import { api } from '@/utils/api'
import { ActionIcon, Button, Center, Flex, Group, Loader, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import moment from 'moment'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { modals } from '@mantine/modals'
import CreateOrganizationForm from './components/forms/create/CreateOrganizationForm'
import UpdateOrganizationForm from './components/forms/update/UpdateOrganizationForm'

type Props = {}

function OrganizationFeature({ }: Props) {

    const orgs = api.superAdmin.orgs.useQuery()
    const deleteOrgMutation = api.superAdmin.deleteOrg.useMutation()

    return (
        <>
            <div>
                <Flex sx={{ width: '100%' }} justify="space-between">
                    <Title mb="lg">Organizations</Title>
                    <Button onClick={() => {
                        modals.open({
                            title: 'Create Organization',
                            centered: true,
                            children: (
                                <>
                                    <CreateOrganizationForm onSuccess={() => {
                                        orgs.refetch()
                                        modals.closeAll()
                                    }} />
                                </>
                            )
                        })
                    }}>Create Organization</Button>
                </Flex>
                {orgs.isFetching ? (
                    <Loader mb="md" />
                ) : (<></>)}
                {orgs.data?.records?.length ? (
                    <DataTable
                        withBorder
                        borderRadius="sm"
                        withColumnBorders
                        striped
                        columns={[
                            {
                                accessor: 'org_id',
                                title: 'Organization ID'
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
                                accessor: 'status',
                                title: 'Status'
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (val) => (
                                    <Group spacing={4} position="right" noWrap>
                                        <ActionIcon color="blue" onClick={() => {
                                            modals.open({
                                                title: 'Update Organization',
                                                centered: true,
                                                children: (
                                                    <>
                                                        <UpdateOrganizationForm orgId={val.org_id} onSuccess={() => {
                                                            orgs.refetch()
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
                                                                    <Text mb="md">Deleting organization {val.name}...</Text>
                                                                    <Loader />
                                                                </Stack>
                                                            </Center>
                                                        )
                                                    })
                                                    await deleteOrgMutation.mutateAsync({
                                                        orgId: val.org_id
                                                    })
                                                    orgs.refetch()
                                                    modals.closeAll()
                                                },
                                                children: (
                                                    <>
                                                        <p>Are you sure want to delete organization {val.name}?</p>
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
                        records={orgs.data.records} />
                ) : (<></>)}
            </div>
        </>
    )
}

export default OrganizationFeature