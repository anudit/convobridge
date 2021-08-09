import React, { useContext } from "react";
import Head from 'next/head';
import { Flex, Button, Heading } from "@chakra-ui/react";
import TelegramLoginButton from 'react-telegram-login';
import NavBar from "@/components/Navbar";
import { Web3Context } from "@/contexts/Web3Context";
import { truncateAddress } from "@/utils/stringUtils";
import { SlackIcon } from "@/public/icons";

export default function Home() {

  const web3Context = useContext(Web3Context);
  const { connectWallet, signerAddress, disconnectWallet } = web3Context;

  const handleTelegramResponse = response => {
    console.log(response);
  };

  async function slackAuth(){
    let authUrl = `https://slack.com/openid/connect/authorize?response_type=code&scope=openid%20profile%20email&client_id=2365887896900.2359697771138&state=${signerAddress}&nonce=${signerAddress}&redirect_uri=${encodeURIComponent('https://5ff4c329614e.ngrok.io/api/slackcb')}`;
    window.open(authUrl, '_blank').focus();
  }

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
            <Heading>Bridge Web2 Accounts to Web3</Heading>
            {
              signerAddress == "" ? (
                <Button onClick={()=>{connectWallet()}}>Connect Wallet</Button>
              ) : (
                <>
                  <Heading>{truncateAddress(signerAddress)}</Heading>
                  <Button onClick={disconnectWallet}>Disconnect</Button>
                </>
              )
            }
            <br/>
            {
              signerAddress !== "" ? (
                <Flex direction="column">
                  <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="Convospacebot" />
                  <br/>
                  <Button onClick={slackAuth} fontWeight="100" backgroundColor="white" color="black" borderRadius="100" borderWidth="1px" borderColor="grey"  _hover={{backgroundColor:"#eee"}}>
                    <SlackIcon boxSize={8} />
                      Log in with Slack
                    </Button>
                  </Flex>
              ) : (<></>)
            }
          </Flex>
        </Flex>
    </>
  )
}
