import React from 'react'
import SuperAdminGuard from '@/components/Auth/roles/SuperAdminGuard'
import SuperAdminRolesFeature from '@/features/super-admin/SuperAdminRolesFeature'
import { Container } from '@mantine/core'

type Props = {}

function SuperAdminRolesPage({ }: Props) {

    return (
        <>
            <SuperAdminGuard>
                <Container>
                    <SuperAdminRolesFeature />
                </Container>
            </SuperAdminGuard>
        </>
    )
}

export default SuperAdminRolesPage