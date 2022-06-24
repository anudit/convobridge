import React from "react";
import { Button } from "@chakra-ui/react";
import { DisconnectIcon } from "@/public/icons";

const ButtonShell = ({children, ...props}) =>{
    return (
        <Button fontWeight="100" color="white" borderRadius="100" {...props}>
            {children}
        </Button>
    )
}

const SimpleButton = ({accent, onClick, children, loadingType='', type='connect'}) => {
    if (type === 'connect'){
        return (
            <ButtonShell
                title="Connect Account"
                onClick={onClick}
                backgroundColor={accent}
                _hover={{backgroundColor: accent, transform: 'scale(1.05)'}}
            >
                {children}
            </ButtonShell>
        )
    }
    else if (type === 'disconnect'){
        return (
            <ButtonShell
                title="Disconnect"
                onClick={onClick}
                isLoading={loadingType === 'unstoppable'}
                backgroundColor={accent}
                _hover={{backgroundColor:"#d9534f", transform: 'scale(1.05)'}} // red
            >
                <DisconnectIcon boxSize={4} mr={2} />
                {children}
            </ButtonShell>
        );
    }
}

export default SimpleButton;
