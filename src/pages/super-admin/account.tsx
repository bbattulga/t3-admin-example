import AuthGuard from '@/components/Auth/AuthGuard';
import { ROLE_SUPER_ADMIN } from '@/shared';
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

interface SuperAdminAccountPageProps {
    image: string;
    avatar: string;
    name: string;
    job: string;
    stats: { label: string; value: string }[];
}

export default function SuperAdminAccountPage({ image, avatar, name, job, stats }: SuperAdminAccountPageProps) {
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
        <AuthGuard role={[ROLE_SUPER_ADMIN]}>
            <Center>
                <Card withBorder sx={(theme) => ({
                    [theme.fn.largerThan('md')]: {
                        maxWidth: 600,
                        minWidth: 400
                    }
                })} padding="xl" radius="md" className={classes.card}>
                    <Card.Section sx={{ backgroundImage: `url(${image})`, height: 140 }} />
                    <Avatar src={session.data.user.image} size={80} radius={80} mx="auto" mt={-30} className={classes.avatar} />
                    <Text ta="center" fz="lg" fw={500} mt="sm">
                        {name}
                    </Text>
                    <Text ta="center" fz="sm" c="dimmed">
                        {job}
                    </Text>
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
                        await signOut()
                        router.push('/')
                    }} variant={"filled"} fullWidth size="md" mt="xl">
                        Logout
                    </Button>
                </Card>
            </Center>
        </AuthGuard>
    );
}