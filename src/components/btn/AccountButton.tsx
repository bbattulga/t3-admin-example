import { AuthSession } from '@/server/auth'
import { Button, Group } from '@mantine/core'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import AuthConditional from '../Auth/AuthConditional'

type Props = {

}

function AccountButton({ }: Props) {

    const router = useRouter()

    return (
        <AuthConditional
            unauthenticated={<></>}
            authenticated={(session) => (
                <>
                    <Group>
                        <Button onClick={() => {
                            router.push(`/${session.data?.user.role}/account`)
                        }}>{session.data?.user.email}</Button>
                        <Button onClick={async () => {
                            await signOut({
                                callbackUrl: '/'
                            })
                        }} variant="default">Logout</Button>
                    </Group>
                </>
            )}
        />
    )
}

export default AccountButton