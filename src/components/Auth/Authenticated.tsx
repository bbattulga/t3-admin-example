import { AuthSession } from '@/server/auth'
import { Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'

type Props = {
    children: React.ReactNode | ((session: AuthSession) => React.ReactNode)
}

function Authenticated({ children }: Props) {
    const sessionData = useSession()
    if (sessionData.status === 'loading') {
        return <Loader />
    }
    if (sessionData.status === 'authenticated') {
        return <>{children}</>
    }
    return (
        <></>
    )
}

export default Authenticated