import { ROLE_SUPER_ADMIN } from '@/shared'
import React from 'react'
import AuthGuard from '../AuthGuard'

type Props = {
    children: React.ReactNode
}

function SuperAdminGuard({ children }: Props) {
    return (
        <AuthGuard role={[ROLE_SUPER_ADMIN]}>
            {children}
        </AuthGuard>
    )
}

export default SuperAdminGuard