import { UserRole } from '@/server/auth';
import { Center, Loader, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {
    role: UserRole[];
    children: React.ReactNode,
}

function AuthorizedView({ role, children }: Props) {

    const session = useSession()

    if (session.status === 'loading') {
        return <></>
    }
    if (!session.data) {
        return <></>
    }
    if (!role.includes(session.data.user.role)) {
        return <></>
    }
    return (
        <>
            {children}
        </>
    )
}

export default AuthorizedView