import SuperAdminGuard from '@/components/Auth/roles/SuperAdminGuard'
import AdminUsersFeature from '@/features/super-admin/AdminUsersFeature'
import { Container } from '@mantine/core'
import React from 'react'

type Props = {}

function AdminUsersPage({ }: Props) {
    return (
        <SuperAdminGuard>
            <Container>
                <AdminUsersFeature />
            </Container>
        </SuperAdminGuard>
    )
}

export default AdminUsersPage