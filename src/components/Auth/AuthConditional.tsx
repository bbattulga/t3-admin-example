import { AuthSession } from '@/server/auth'
import { Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'

type Props = {
    authenticated: React.ReactNode | ((session: AuthSession) => React.ReactNode),
    unauthenticated: React.ReactNode
}

function AuthConditional({ authenticated, unauthenticated }: Props) {
    const sessionData = useSession()
    if (sessionData.status === 'loading') {
        return <Loader />
    }
    if (sessionData.status === 'authenticated') {
        return <>{typeof authenticated === 'function' ? authenticated(sessionData) : authenticated}</>
    }
    if (sessionData.status === 'unauthenticated') {
        return <>{unauthenticated}</>
    }
    return (
        <></>
    )
}

export default AuthConditional