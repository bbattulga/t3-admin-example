import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  Loader,
  Box,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import image from '@/asset/img/hero.svg'
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react'

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export function HomePage() {

  const { classes } = useStyles();
  const sessionData = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (sessionData.status === 'authenticated') {
      router.push(`/${sessionData.data.user.role}/dashboard`)
    }
  }, [sessionData, router])

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Lotto Management System
            </Title>
            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>TypeScript based</b> – build type safe applications, all components and hooks
                export types
              </List.Item>
              <List.Item>
                <b>Free and open source</b> – all packages have MIT license, you can use Mantine in
                any project
              </List.Item>
              <List.Item>
                <b>No annoying focus ring</b> – focus ring will appear only when user navigates with
                keyboard
              </List.Item>
            </List>

            {sessionData.status === 'loading' ? (
              <Loader />
            ) : (
              <Group mt={30}>
                {sessionData.status === 'unauthenticated' ? (
                  <>
                    <Button onClick={() => {
                      router.push('/doc')
                    }} radius="xl" size="md" className={classes.control}>
                      Documentation
                    </Button>
                    <Button onClick={() => {
                      signIn('google')
                    }} radius="xl" variant="default" size="md" className={classes.control}>
                      Login
                    </Button>
                  </>
                ) : <></>}
                {sessionData.status === 'authenticated' ? (
                  <Group>
                    <Box>
                      <p>Logged In as</p>
                      <p>{sessionData.data.user.email}</p>
                      <p>{sessionData.data.user.role}</p>
                    </Box>
                    <Button onClick={async () => {
                      await signOut({
                        callbackUrl: '/'
                      })
                    }} mt={2} variant="default" radius="xl" size="md" className={classes.control}>
                      Logout
                    </Button>
                  </Group>
                ) : <></>}
              </Group>
            )}
          </div>
          <Image src={image.src} className={classes.image} />
        </div>
      </Container>
    </div>
  );
}

export default HomePage