import AuthGuard from '@/components/Auth/AuthGuard';
import AdminGuard from '@/components/Auth/roles/AdminGuard';
import { createStyles, Card, Avatar, Text, Group, Button, rem, Loader, Title, Box, Center } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    avatar: {
        border: `${rem(2)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
}));

interface AccountPageProps {

}

export default function AdminAccountPage({ ...props }: AccountPageProps) {
    const { classes, theme } = useStyles();
    const router = useRouter()
    const session = useSession()

    if (session.status === 'loading') {
        return <Center><Loader /></Center>
    }

    if (session.status === 'unauthenticated' || !session.data) {
        return <Center><Title>Unauthorized</Title></Center>
    }

    return (
        <AdminGuard>
            <Center>
                <Card withBorder sx={(theme) => ({
                    [theme.fn.largerThan('md')]: {
                        maxWidth: 600,
                        minWidth: 400
                    }
                })} padding="xl" radius="md" className={classes.card}>
                    <Avatar src={session.data.user.image} size={80} radius={80} mx="auto" className={classes.avatar} />
                    <Group mt="md" position="center" spacing={30}>
                        <div>
                            <Text ta="center" fz="lg" fw={500}>
                                {session.data.user.email}
                            </Text>
                            <Text ta="center" fz="sm" c="dimmed">
                                {session.data.user.roleName}
                            </Text>
                        </div>
                    </Group>
                    <Button onClick={async () => {
                        await signOut({
                            callbackUrl: '/'
                        })
                    }} variant={"filled"} fullWidth size="md" mt="xl">
                        Logout
                    </Button>
                </Card>
            </Center>
        </AdminGuard>
    );
}