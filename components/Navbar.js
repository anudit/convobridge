import React from "react";
import Link from 'next/link';
import { Tooltip, Flex, IconButton, useColorMode, useColorModeValue, Text } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { ConvoIcon } from "@/public/icons";

const NavBar = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-around"
      wrap="wrap"
      w="100%"
      py={5}
      bg={["dark.500", "dark.500", "transparent", "transparent"]}
      position="fixed"
      background={useColorModeValue("#ececec30", "#15151930")}
      backdropFilter="blur(10px)"
      zIndex="100"
      borderBottomWidth="1px"
    >
      <Flex direction="row">
        <ConvoIcon boxSize={7}/>
        <Link href="/" style={{textDecoration: 'inherit'}} fontWeight={400}>
          <Text ml={3} as="h1" fontSize="larger" cursor="pointer">
            Convo Space
          </Text>
        </Link>
      </Flex>
      <Tooltip hasArrow label={useColorModeValue("Switch to Dark Mode", "Switch to Light Mode")} aria-label="A tooltip">
        <IconButton
          icon={useColorModeValue(<MoonIcon/>, <SunIcon/>)}
          onClick={toggleColorMode}
          size="sm"
          rounded="md"
          aria-label="Toggle Theme"
          variant="ghost"
        />
      </Tooltip>
    </Flex>
  );
};

export default NavBar;
