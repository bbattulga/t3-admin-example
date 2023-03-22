import { UserRole } from '@/server/auth';
import { ROLE_SUPER_ADMIN } from '@/shared/consts/roles';
import { Center, Loader, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {
    role: UserRole[];
    children: React.ReactNode,
}

function AuthGuard({ role, children }: Props) {

    const session = useSession()

    if (session.status === 'loading') {
        return <Center><Loader /></Center>
    }
    if (session.status === 'unauthenticated') {
        return <Center><Title>Unauthenticated</Title></Center>
    }
    if (!session.data) {
        return <Center><Title>Authorization data not found</Title></Center>
    }
    if (session.data.user.role === ROLE_SUPER_ADMIN) {
        return (
            <>
                {children}
            </>
        )
    }
    if (!role.includes(session.data.user.role)) {
        return <Center><Title>Permission Denied</Title></Center>
    }
    return (
        <>
            {children}
        </>
    )
}

export default AuthGuard