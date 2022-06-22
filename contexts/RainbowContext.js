import React, { createContext, useEffect, useState } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { chain, createClient, WagmiConfig, useAccount, configureChains, useProvider  } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { midnightTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { useColorModeValue } from '@chakra-ui/react'
import { lightTheme } from '@rainbow-me/rainbowkit'


const { chains, provider } = configureChains(
	[chain.mainnet],
	[infuraProvider({infuraId :"1e7969225b2f4eefb3ae792aabf1cc17"}), publicProvider()]
)

const { connectors } = getDefaultWallets({ appName: "Convo Bridge", chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })

export const RainbowContext = createContext(undefined);

export const RainbowContextProvider = ({children}) => {

    return (
		<WagmiConfig client={wagmiClient} coolMode>
			<RainbowKitProvider
                coolMode
                chains={chains}
                theme={useColorModeValue(lightTheme({
                    borderRadius: 'large',
                    overlayBlur: 'small',
                }), midnightTheme({
                    connectButtonBackground: '#0000',
                    accentColorForeground: 'white',
                    borderRadius: 'large',
                    overlayBlur: 'small',
                }))}
            >
                <RainbowKit>
                    {children}
                </RainbowKit>
			</RainbowKitProvider>
		</WagmiConfig>
	)

};

async function addressToEns(address){
    try {

        let resp = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
            "headers": {
                "accept": "*/*",
                "content-type": "application/json",
            },
            "body": JSON.stringify(
                {
                    "query":`
                    {
                        domains(where: {resolvedAddress: "${address.toLowerCase()}"}) {
                          name
                        }
                    }`,
                    "variables":null
                }
            ),
            "method": "POST",
        }).then((r)=>{return r.json()});

        if (Boolean(resp['data']["domains"].length) === false){
            return false;
        }
        else {
            return resp['data']["domains"][resp['data']["domains"].length-1]?.name;
        }

    } catch (error) {
        console.log('addressToEns.error', error)
        return false;
    }
}

const RainbowKit = ({children}) => {

    const [signerAddress, setSignerAddress] = useState("");
    const [ensAddress, setEnsAddress] = useState("");

    const { data: accountData } = useAccount();
    const provider = useProvider();

    useEffect(()=>{
        if(Boolean(accountData?.address) === true){
            setSignerAddress(accountData.address);
            addressToEns(accountData.address).then((r)=>{
                if (Boolean(r) == true){
                    setEnsAddress(r);
                }
            })
        }
        else {
            setSignerAddress("")
            setEnsAddress('')
        }
    }, [accountData]);

    return (
        <RainbowContext.Provider value={{
            signerAddress,
            ensAddress,
            provider,
            // web3Modal
        }}>
            {children}
        </RainbowContext.Provider>
	)

};
