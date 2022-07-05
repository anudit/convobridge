import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { WrapItem } from "@chakra-ui/react";
import { truncateAddress } from "@/utils/stringUtils";
import SimpleButton from "./SimpleButton";

const CardShell2 = ({icon, title, cardKey, bridgeData, accent, authFn, disconnectAuth, loadingType, disabled = false}) => {

  return (
    <WrapItem display={disabled && "none"}>
      <Flex width="220px" height="150px" borderRadius="20px" borderWidth="1px" borderColor={accent} flexDirection="column" alignItems="center" justifyContent="space-around">
        <Flex direction="row" alignItems="center" w="100%" justifyContent="space-around" >
          <Text>
            {title}
          </Text>
          {icon}
        </Flex>
        {
          Boolean(bridgeData[cardKey]) !== false ? (
            <SimpleButton
              accent={accent}
              type="disconnect"
              isLoading={loadingType === cardKey}
              onClick={disconnectAuth}
            >
              {typeof bridgeData[cardKey] === 'string' ? truncateAddress(bridgeData[cardKey]) : 'Verified'}
            </SimpleButton>
          ) : (
            <SimpleButton onClick={authFn} accent={accent}>
              Connect
            </SimpleButton>
          )
        }
      </Flex>
    </WrapItem>
  );
};

export default CardShell2;
