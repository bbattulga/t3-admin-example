import { ROLE_ADMIN } from '@/shared'
import React from 'react'
import AuthGuard from '../AuthGuard'

type Props = {
    children: React.ReactNode
}

function AdminGuard({ children }: Props) {
    return (
        <AuthGuard role={[ROLE_ADMIN]}>
            {children}
        </AuthGuard>
    )
}

export default AdminGuard