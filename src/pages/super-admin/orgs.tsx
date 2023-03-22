import { Container } from '@mantine/core'
import React from 'react'
import SuperAdminGuard from '@/components/Auth/roles/SuperAdminGuard'
import OrganizationFeature from '@/features/super-admin/OrganizationFeature'

type Props = {}

function SuperAdminUsers({ }: Props) {

    return (
        <>
            <SuperAdminGuard>
                <Container>
                    <OrganizationFeature />
                </Container>
            </SuperAdminGuard>
        </>
    )
}

export default SuperAdminUsers