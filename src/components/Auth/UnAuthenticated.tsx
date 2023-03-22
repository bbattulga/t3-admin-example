import { Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'

type Props = {
    children: React.ReactNode
}

function UnAuthenticated({ children }: Props) {
    const sessionData = useSession()
    if (sessionData.status === 'loading') {
        return <></>
    }
    if (sessionData.status === 'unauthenticated') {
        return <>{children}</>
    }
    return (
        <></>
    )
}

export default UnAuthenticated