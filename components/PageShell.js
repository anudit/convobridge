import React from 'react';
import Head from 'next/head';
import { Flex, Heading, Text } from "@chakra-ui/react";
import NavBar from './Navbar';

export default function Shell({children}) {
    return (
        <>
            <Head>
                <title>Convo | Bridge</title>
                <meta name="description" content="Bridge" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar />
            <Flex direction="column" p={2} alignItems="center">
                <Flex py={8} mt={{base: 0, md: 16}} flexDirection="column" align="center" mb={{base: 2, md: 16}}>
                    <Heading>Bridge</Heading>
                    <Text fontSize="md">Bridge your Web2 Accounts to Web3</Text>
                </Flex>
                <Flex direction="column" justifyContent="center" alignItems="center" textAlign="center" w={{base:"100vw", md:"60vw"}} mb={{base: "100px", md: null}}>
                    {children}
                </Flex>
            </Flex>
        </>
    )
}
