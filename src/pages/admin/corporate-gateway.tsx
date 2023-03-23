import AdminGuard from '@/components/Auth/roles/AdminGuard'
import AdminCorporateGatewayFeature from '@/features/admin/AdminCorporateGatewayFeature'
import { Container, Title } from '@mantine/core'
import React from 'react'

type Props = {}

function AdminCorporateGatewayPage({ }: Props) {
    return (
        <>
            <AdminGuard>
                <Container>
                    <Title>Corporate Gateway</Title>
                    <AdminCorporateGatewayFeature />
                </Container>
            </AdminGuard>
        </>
    )
}

export default AdminCorporateGatewayPage