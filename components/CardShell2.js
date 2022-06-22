import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { WrapItem } from "@chakra-ui/react";
import { truncateAddress } from "@/utils/stringUtils";
import { DisconnectIcon } from "@/public/icons";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

const CardShell = ({icon, title, cardKey, bridgeData, accent, authFn, disconnectAuth, loadingType}) => {

  return (
    <WrapItem>
      <Flex width="220px" height="150px" borderRadius="20px" borderWidth="1px" borderColor={accent} flexDirection="column" alignItems="center" justifyContent="space-around">
        <Flex direction="row" alignItems="center" w="100%" justifyContent="space-around" >
          <Text>
            {title}
          </Text>
          {icon}
        </Flex>
        {
          Boolean(bridgeData[cardKey]) !== false ? (
            <Tooltip label='Disconnect' aria-label='Disconnect' placement='top'>
              <Button isLoading={loadingType === cardKey} onClick={()=>{disconnectAuth(cardKey)}} fontWeight="100" backgroundColor={accent} color="white" borderRadius="100"  _hover={{backgroundColor:'#d9534f'}}>
                <DisconnectIcon boxSize={4} mr={2} />
                {truncateAddress(bridgeData[cardKey])}
              </Button>
            </Tooltip>
          ) : (
            <Button onClick={authFn} fontWeight="100" backgroundColor={accent} color="white" borderRadius="100">
              Connect
            </Button>
          )
        }
      </Flex>
    </WrapItem>
  );
};

export default CardShell;
