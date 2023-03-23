import AdminGuard from '@/components/Auth/roles/AdminGuard'
import AdminDashboardFeature from '@/features/admin/AdminDashboardFeature'
import { Container, Title } from '@mantine/core'
import React from 'react'

type Props = {}

function AdminDashboardPage({ }: Props) {
    return (
        <AdminGuard>
            <Container>
                <Title>Dashboard</Title>
                <AdminDashboardFeature />
            </Container>
        </AdminGuard>
    )
}

export default AdminDashboardPage