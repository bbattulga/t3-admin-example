import AdminGuard from '@/components/Auth/roles/AdminGuard'
import AdminLotteryFeature from '@/features/admin/AdminLotteryFeature'
import { Container, Title } from '@mantine/core'
import React from 'react'

type Props = {}

function AdminUsersPage({ }: Props) {
    return (
        <>
            <AdminGuard>
                <Container>
                    <Title>Lottery</Title>
                    <AdminLotteryFeature />
                </Container>
            </AdminGuard>
        </>
    )
}

export default AdminUsersPage