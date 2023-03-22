import React from 'react'
import Navbar from '@/components/nav/Navbar'

type Props = {
    children: React.ReactNode
}

function Layout({ children }: Props) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Layout