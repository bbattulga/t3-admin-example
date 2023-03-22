import AuthGuard from '@/components/Auth/AuthGuard';
import SuperAdminGuard from '@/components/Auth/roles/SuperAdminGuard';
import { ROLE_SUPER_ADMIN } from '@/shared';
import { api } from '@/utils/api';
import { createStyles, Group, Paper, SimpleGrid, Text, rem, Loader, Center, Flex, Title, Container } from '@mantine/core';
import {
    IconUserPlus,
    IconDiscount2,
    IconReceipt2,
    IconCoin,
    IconArrowUpRight,
    IconArrowDownRight,
} from '@tabler/icons-react';

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

const icons = {
    user: IconUserPlus,
    discount: IconDiscount2,
    receipt: IconReceipt2,
    coin: IconCoin,
};

interface SuperAdminPageProps {

}

export default function SuperAdminPage({ }: SuperAdminPageProps) {
    const { classes } = useStyles();
    const {
        isLoading: isDashboardLoading,
        data: dashboardData
    } = api.superAdmin.dashboard.useQuery()
    return (
        <SuperAdminGuard>
            <Container>
                <Title>Dashboard</Title>
                <div className={classes.root}>
                    <SimpleGrid
                        cols={4}
                        breakpoints={[
                            { maxWidth: 'md', cols: 2 },
                            { maxWidth: 'xs', cols: 1 },
                        ]}
                    >
                        {isDashboardLoading && !dashboardData ? (
                            <Loader />
                        ) : (<></>)}
                        {dashboardData ? (
                            <>
                                <Paper withBorder p="md" radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" className={classes.title}>
                                            Admin Users
                                        </Text>
                                    </Group>
                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text className={classes.value}>{dashboardData.adminCount}</Text>
                                    </Group>
                                </Paper>
                                <Paper withBorder p="md" radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" className={classes.title}>
                                            Roles
                                        </Text>
                                    </Group>
                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text className={classes.value}>{dashboardData.roleCount}</Text>
                                    </Group>
                                </Paper>
                                <Paper withBorder p="md" radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" className={classes.title}>
                                            Organizations
                                        </Text>
                                    </Group>
                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text className={classes.value}>{dashboardData.orgCount}</Text>
                                    </Group>
                                </Paper>
                                <Paper withBorder p="md" radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" className={classes.title}>
                                            User Count
                                        </Text>
                                    </Group>
                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text className={classes.value}>{dashboardData.userCount}</Text>
                                    </Group>
                                </Paper>
                            </>
                        ) : (<></>)}
                    </SimpleGrid>
                </div>
            </Container>
        </SuperAdminGuard>
    );
}