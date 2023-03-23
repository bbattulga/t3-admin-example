import { api } from '@/utils/api';
import { createStyles, Group, Paper, SimpleGrid, Text, rem, Loader, Center, Flex, Title, Container } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    root: {
        padding: `calc(${theme.spacing.xl} * 1.5)`,
    },

    value: {
        fontSize: rem(24),
        fontWeight: 700,
        lineHeight: 1,
    },

    diff: {
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    title: {
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));

interface AdminDashboardFeatureProps {

}

export default function AdminDashboardFeature({ }: AdminDashboardFeatureProps) {
    const { classes } = useStyles();
    const {
        isLoading: isDashboardLoading,
        data: dashboard
    } = api.admin.dashboard.useQuery()

    return (
        <div className={classes.root}>
            <SimpleGrid
                cols={4}
                breakpoints={[
                    { maxWidth: 'md', cols: 2 },
                    { maxWidth: 'xs', cols: 1 },
                ]}
            >
                {isDashboardLoading && !dashboard ? (
                    <Loader />
                ) : (<></>)}
                {dashboard ? (
                    <>
                        <Paper withBorder p="md" radius="md">
                            <Group position="apart">
                                <Text size="xs" color="dimmed" className={classes.title}>
                                    Admin Users
                                </Text>
                            </Group>
                            <Group align="flex-end" spacing="xs" mt={25}>
                                <Text className={classes.value}>{dashboard.adminCount}</Text>
                            </Group>
                        </Paper>
                        <Paper withBorder p="md" radius="md">
                            <Group position="apart">
                                <Text size="xs" color="dimmed" className={classes.title}>
                                    Lottery
                                </Text>
                            </Group>
                            <Group align="flex-end" spacing="xs" mt={25}>
                                <Text className={classes.value}>0</Text>
                            </Group>
                        </Paper>
                        <Paper withBorder p="md" radius="md">
                            <Group position="apart">
                                <Text size="xs" color="dimmed" className={classes.title}>
                                    User
                                </Text>
                            </Group>
                            <Group align="flex-end" spacing="xs" mt={25}>
                                <Text className={classes.value}>0</Text>
                            </Group>
                        </Paper>
                    </>
                ) : (<></>)}
            </SimpleGrid>
        </div>
    );
}