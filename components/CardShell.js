import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { WrapItem } from "@chakra-ui/react";

const CardShell = ({icon, title, children, accent}) => {

  return (
    <WrapItem>
      <Flex width="220px" height="150px" borderRadius="20px" borderWidth="1px" borderColor={accent} flexDirection="column" alignItems="center" justifyContent="space-around">
        <Flex direction="row" alignItems="center" w="100%" justifyContent="space-around" >
          <Text>
            {title}
          </Text>
          {icon}
        </Flex>
        {children}
      </Flex>
    </WrapItem>
  );
};

export default CardShell;
