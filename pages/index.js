import React, { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import { Flex, Button, Heading, Text } from "@chakra-ui/react";
import TelegramLoginButton from 'react-telegram-login';
import NavBar from "@/components/Navbar";
import { Web3Context } from "@/contexts/Web3Context";
import { truncateAddress } from "@/utils/stringUtils";
import { DisconnectIcon, DiscordIcon, SlackIcon } from "@/public/icons";
import { isAddress } from "ethers/lib/utils";

export default function Home() {

  const web3Context = useContext(Web3Context);
  const { connectWallet, signerAddress, disconnectWallet } = web3Context;
  const [ bridgeData, setBridgeData ] = useState(undefined);

  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  const handleTelegramResponse = response => {
    console.log(response);
  };

  async function slackAuth(){
    let authUrl = `https://slack.com/openid/connect/authorize?response_type=code&scope=openid%20profile%20email&client_id=2365887896900.2359697771138&state=${signerAddress}&nonce=${signerAddress}&redirect_uri=${encodeURIComponent(NEXT_PUBLIC_SITE_URL + '/api/slackcb')}`;
    window.location.href = authUrl;
  }

  async function discordAuth(){
    let reduri = NEXT_PUBLIC_SITE_URL + '/api/discordcb';
    let red = encodeURIComponent(reduri);
    console.log(reduri, red);
    let authUrl = `https://discord.com/api/oauth2/authorize?client_id=874563415228702751&redirect_uri=${red}&response_type=code&scope=identify%20email&state=${signerAddress}`;
    window.location.href = authUrl;
  }

  useEffect(() => {
    async function fetchData(){
      if (isAddress(signerAddress) === true) {
        let data = await fetch('/api/bridge?address='+signerAddress).then(data=>{return data.json()});
        setBridgeData(data);
        console.log(data);
      }
    }
    fetchData();
  }, [signerAddress]);


  return (
    <>
        <Head>
            <title>Convo Bridge</title>
            <meta name="description" content="Janus" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <Flex direction="column" p="200px" alignItems="center" h="100vh">
          <Flex direction="column" justifyContent="center" alignItems="center" textAlign="center" w={{base:"100vw", md:"50vw"}}>
            <Heading>🌉 Convo Bridge</Heading>
            <Text fontSize="md">Bridge your Web2 Accounts to Web3</Text>
            <Flex direction="row" justifyContent="center" alignItems="center" mt={4}>
              {
                signerAddress == "" ? (
                  <Button onClick={()=>{connectWallet()}}>Connect Wallet</Button>
                ) : (
                  <>
                    <Text fontSize="xl">{truncateAddress(signerAddress)}</Text>
                    <Button onClick={()=>{
                        setBridgeData(undefined);
                        disconnectWallet();
                      }}
                      variant="ghost"
                      ml={2}
                    >
                      <DisconnectIcon/>
                    </Button>
                  </>
                )
              }
            </Flex>
            <br/>
            <br/>
            {
              signerAddress !== "" && Boolean(bridgeData) === true ? (
                <Flex direction="column">
                  <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="Convospacebot" />
                  <br/>

                  <Button onClick={slackAuth} fontWeight="100" backgroundColor="white" color="black" borderRadius="100" borderWidth="1px" borderColor="grey"  _hover={{backgroundColor:"#ddd"}}>
                    <SlackIcon boxSize={8} />
                    Log in with Slack
                  </Button>
                  <br/>
                  <Button onClick={discordAuth} fontWeight="100" backgroundColor="#5865f2" color="white" borderRadius="100" _hover={{backgroundColor:"#3c45a5"}}>
                    <DiscordIcon boxSize={5} mr={4}/>
                    Log in with Discord
                  </Button>
                </Flex>
              ) : (<></>)
            }
          </Flex>
        </Flex>
    </>
  )
}
