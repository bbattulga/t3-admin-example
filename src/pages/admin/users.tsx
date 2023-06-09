import AdminGuard from '@/components/Auth/roles/AdminGuard'
import AdminLotteryUsersFeature from '@/features/admin/AdminLotteryUsersFeature'
import { Container, Title } from '@mantine/core'
import React from 'react'

type Props = {}

function AdminUsersPage({ }: Props) {
    return (
        <>
            <AdminGuard>
                <Container>
                    <Title>Lottery Users</Title>
                    <AdminLotteryUsersFeature />
                </Container>
            </AdminGuard>
        </>
    )
}

export default AdminUsersPage