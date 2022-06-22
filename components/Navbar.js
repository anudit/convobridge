import React from "react";
import { Tooltip, Flex, IconButton, useColorMode, useColorModeValue, Text } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <Flex w="100%" justifyContent="center" flexDirection="row">
      <Flex
        as="nav"
        justify="space-around"
        w={{base:"300px", md:"min(80%, 500px)"}}
        py={2}
        bg={["dark.500", "dark.500", "transparent", "transparent"]}
        position="fixed"
        background={useColorModeValue("#ececec30", "#15151930")}
        backdropFilter="blur(10px)"
        bottom={{base:"10px", md: undefined}}
        h="60px"
        top={{base:undefined, md: "10px" }}
        zIndex="100"
        borderRadius="30px"
        borderWidth="1px"
        alignItems="center"
      >
        <Text>
          🌉
        </Text>
        <ConnectButton showBalance={false} />
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
    </Flex>
  );
};

export default NavBar;
