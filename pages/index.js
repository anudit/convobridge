import React, { useContext, useEffect, useRef, useState } from "react";
import Head from 'next/head';
import { Flex, Button, Heading, Text, useDisclosure, Input, Progress, IconButton } from "@chakra-ui/react";
import TelegramLoginButton from 'react-telegram-login';
import NavBar from "@/components/Navbar";
import { Web3Context } from "@/contexts/Web3Context";
import { truncateAddress } from "@/utils/stringUtils";
import { AadharIcon, DisconnectIcon, DiscordIcon, SlackIcon, SpotifyIcon, TwitchIcon, ZoomIcon } from "@/public/icons";
import { isAddress } from "ethers/lib/utils";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { RepeatIcon } from "@chakra-ui/icons";

export default function Home() {

  const { connectWallet, signerAddress, disconnectWallet } = useContext(Web3Context);
  const [ bridgeData, setBridgeData ] = useState(undefined);
  const NEXT_PUBLIC_ZOOM_CLIENT_ID = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  const [ loadingType, setLoadingType ] = useState('');


  async function sendData(url = '', data = {}, method="GET") {
    const response = await fetch(url, {
      method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  const handleTelegramResponse = async (response) => {
    await sendData('/api/bridge?type=telegram&ethAddress='+signerAddress, response, "POST");
    let data = await fetch('/api/bridge?address='+signerAddress).then(data=>{return data.json()});
    setBridgeData(data);
    console.log(data);
    setLoadingType('');
  };

  const disconnectAuth = async (type) => {
    setLoadingType(type);
    await sendData('/api/bridge?type='+type+'&ethAddress='+signerAddress, {}, "DELETE");
    let data = await fetch('/api/bridge?address='+signerAddress).then(data=>{return data.json()});
    setBridgeData(data);
    console.log(data);
    setLoadingType('');
  };

  async function slackAuth(){
    let authUrl = `https://slack.com/openid/connect/authorize?response_type=code&scope=openid%20profile%20email&client_id=2365887896900.2359697771138&state=${signerAddress}&nonce=${signerAddress}&redirect_uri=${encodeURIComponent(NEXT_PUBLIC_SITE_URL + '/api/slackcb')}`;
    window.open(authUrl, '_blank').focus();
  }

  async function discordAuth(){
    let reduri = NEXT_PUBLIC_SITE_URL + '/api/discordcb';
    let red = encodeURIComponent(reduri);
    let authUrl = `https://discord.com/api/oauth2/authorize?client_id=874563415228702751&redirect_uri=${red}&response_type=code&scope=identify%20email&state=${signerAddress}`;
    window.open(authUrl, '_blank').focus();
  }

  async function zoomAuth(){
    let reduri = NEXT_PUBLIC_SITE_URL + '/api/zoomcb';
    let red = encodeURIComponent(reduri);
    let authUrl = `https://zoom.us/oauth/authorize?client_id=${NEXT_PUBLIC_ZOOM_CLIENT_ID}&redirect_uri=${red}&response_type=code&scope=user%3Aread&state=${signerAddress}`;
    window.open(authUrl, '_blank').focus();
  }

  async function spotifyAuth(){
    let reduri = NEXT_PUBLIC_SITE_URL + '/api/spotifycb';
    let red = encodeURIComponent(reduri);
    let authUrl = `https://accounts.spotify.com/authorize?client_id=bd08b95348ab43a8ae061c0a28379642&redirect_uri=${red}&response_type=code&scope=user-read-private%20user-read-email&state=${signerAddress}`;
    window.open(authUrl, '_blank').focus();
  }

  async function twitchAuth(){
    let reduri = NEXT_PUBLIC_SITE_URL + '/api/twitchcb';
    let red = encodeURIComponent(reduri);
    let authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=ghb2na9qbwpfvn2557fetvll6lxf1p&redirect_uri=${red}&response_type=code&scope=user:read:email&state=${signerAddress}`;
    window.open(authUrl, '_blank').focus();
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ aadharData, setAadharData ] = useState(undefined);
  const [ progressState, setProgressState ] = useState(null);
  const [ loadingState, setLoadingState ] = useState(false);
  const aadharRef = useRef();
  const mobileRef = useRef();
  const captchaRef = useRef();
  const otpRef = useRef();

  const aadharStateData = {
    null : {
      loading: 0,
      nextbtn: "Loading"
    },
    captcha : {
      loading: 33,
      nextbtn: "Verify Captcha"
    },
    genOtp : {
      loading: 66,
      nextbtn: "Verify OTP"
    },
    allDone : {
      loading: 100,
      nextbtn: "Close"
    }
  }

  async function updateCaptcha(){
    fetch('/api/aadhar/getCaptcha').then(data=>{
      return data.json()
    }).then(json=>{
      console.log(json)
      setAadharData(json)
      setLoadingState(false);
      setProgressState('captcha')
    });
  }

  async function genOtp(){
    setLoadingState(true);
    let captchaAnswer = captchaRef.current.value;
    let aadharNumber = aadharRef.current.value;
    let mobileNumber = mobileRef.current.value;

    const bodyData = {
      address: signerAddress,
      captchaTxnId: aadharData?.captchaTxnId,
      uidNumber: aadharNumber,
      captcha: captchaAnswer,
      verificationCode: "",
      mobileNumber: mobileNumber
    };
    console.log('bodyData', JSON.stringify(bodyData));


    let respData = await fetch('/api/aadhar/verify', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
    });
    respData = await respData.json();

    if ('errorCode' in respData){
      alert(respData?.errorDetails?.messageEnglish)
      if (respData?.errorCode === "VEM_VAL_004"){
        updateCaptcha();
      }
    }
    else if('status' in respData  && respData['status'] === 'Success'){
      if(respData['responseData']['code'] === '2006'){
        setProgressState('allDone');
      }
      else {
        setProgressState('genOtp')
      }
    }

    console.log('genOtp', respData);
    setLoadingState(false);
  }

  async function verifyOtp(){
    setLoadingState(true);

    let captchaAnswer = captchaRef.current.value;
    let aadharNumber = aadharRef.current.value;
    let mobileNumber = mobileRef.current.value;
    let otpCode = otpRef.current.value;

    let respData = await fetch('/api/aadhar/verify', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: signerAddress,
        captchaTxnId: aadharData?.captchaTxnId,
        uidNumber: aadharNumber,
        captcha: captchaAnswer,
        verificationCode: otpCode,
        mobileNumber: mobileNumber
      }),
    });
    respData = await respData.json();
    console.log(respData);

    setLoadingState(false);
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
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Aadhar Verification</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Progress hasStripe
                    value={aadharStateData[progressState].loading}
                    size='xs'
                  />
                  {
                    progressState === null && (
                      <></>
                    )
                  }
                  {
                    progressState === 'captcha' && (
                      <>
                        <Text>Step 1/2</Text>
                        <br/>
                        <Input ref={aadharRef} placeholder='Enter your Aadhar Number' size='md' pattern="\d*" maxLength={12} mb={1}/>
                        <Input ref={mobileRef} placeholder='Enter your Mobile Number' size='md' pattern="\d*" maxLength={10} mb={1}/>
                        <Flex direction="row">
                          <Input ref={captchaRef} placeholder='Enter Captcha' size='md' mr={2} mb={1}/>
                          <img src={`data:image/jpeg;base64,${aadharData?.captchaBase64String}`} style={{height: "40px"}}/>
                          <IconButton icon={<RepeatIcon />} onClick={updateCaptcha} ml={2}/>
                        </Flex>
                      </>
                    )
                  }
                  {
                    progressState === 'genOtp' && (
                      <>
                        <Text>Step 2/2</Text>
                        <br/>
                        <Text>An OTP has been sent to your registered mobile number.</Text>
                        <Input ref={otpRef} placeholder='Enter your OTP' size='md' mb={1}/>
                      </>
                    )
                  }
                  {
                    progressState === 'allDone' && (
                      <>
                        <Text>All Done</Text>
                      </>
                    )
                  }
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' size="sm" isLoading={loadingState} onClick={()=>{
                    if(progressState === 'captcha'){
                      genOtp();
                    }
                    else if (progressState === 'genOtp'){
                      verifyOtp();
                    }
                    else if (progressState === 'allDone'){
                      onClose();
                    }
                  }}>
                    {aadharStateData[progressState].nextbtn}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <br/>
            {
              signerAddress !== "" && Boolean(bridgeData) === true ? (
                <Flex direction="column">
                  {
                    Boolean(bridgeData?.aadharData) !== false ? (
                      <Button isLoading={loadingType === 'aadhar'} onClick={()=>{disconnectAuth('aadhar')}} fontWeight="100" backgroundColor="#0088CC" color="white" borderRadius="100"  _hover={{backgroundColor:"#025e8c"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Aadhar {bridgeData?.aadharData?.uidNumber}
                      </Button>
                    ) : (
                      <Button onClick={()=>{
                        updateCaptcha();
                        onOpen();
                      }} fontWeight="100" backgroundColor="white" color="black" borderRadius="100" borderWidth="1px" borderColor="grey"  _hover={{backgroundColor:"#ddd"}}>
                        <AadharIcon boxSize={6} mr={2}/>
                        Log in with Aadhar
                      </Button>
                    )
                  }
                  <br/>
                  {
                    Boolean(bridgeData?.telegram) !== false ? (
                      <Button isLoading={loadingType === 'telegram'} onClick={()=>{disconnectAuth('telegram')}} fontWeight="100" backgroundColor="#0088CC" color="white" borderRadius="100"  _hover={{backgroundColor:"#025e8c"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Telegram {bridgeData?.telegram}
                      </Button>
                    ) : (
                      <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="Convospacebot" />
                    )
                  }
                  <br/>
                  {
                    Boolean(bridgeData?.slack) !== false ? (
                      <Button isLoading={loadingType === 'slack'} onClick={()=>{disconnectAuth('slack')}} fontWeight="100" backgroundColor="white" color="black" borderRadius="100" borderWidth="1px" borderColor="grey"  _hover={{backgroundColor:"#ddd"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Slack {bridgeData?.slack}
                      </Button>
                    ) : (
                      <Button onClick={slackAuth} fontWeight="100" backgroundColor="white" color="black" borderRadius="100" borderWidth="1px" borderColor="grey"  _hover={{backgroundColor:"#ddd"}}>
                        <SlackIcon boxSize={10} />
                        Log in with Slack
                      </Button>
                    )
                  }
                  <br/>
                  {
                    Boolean(bridgeData?.discord) !== false ? (
                      <Button isLoading={loadingType === 'discord'} onClick={()=>{disconnectAuth('discord')}} fontWeight="100" backgroundColor="#5865f2" color="white" borderRadius="100"  _hover={{backgroundColor:"#3c45a5"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Discord {bridgeData?.discord}
                      </Button>
                    ) : (
                      <Button onClick={discordAuth} fontWeight="100" backgroundColor="#5865f2" color="white" borderRadius="100" _hover={{backgroundColor:"#3c45a5"}}>
                        <DiscordIcon boxSize={5} mr={4}/>
                        Log in with Discord
                      </Button>
                    )
                  }
                  <br/>
                  {
                    Boolean(bridgeData?.zoom) !== false ? (
                      <Button isLoading={loadingType === 'zoom'} onClick={()=>{disconnectAuth('zoom')}} fontWeight="100" backgroundColor="#0e71eb" color="white" borderRadius="100"  _hover={{backgroundColor:"#0957b7"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Zoom {truncateAddress(bridgeData?.zoom)}
                      </Button>
                    ) : (
                      <Button onClick={zoomAuth} fontWeight="100" backgroundColor="#0e71eb" color="white" borderRadius="100" _hover={{backgroundColor:"#0957b7"}}>
                        <ZoomIcon boxSize={5} mr={4}/>
                        Log in with Zoom
                      </Button>
                    )
                  }
                  <br/>
                  {
                    Boolean(bridgeData?.spotify) !== false ? (
                      <Button isLoading={loadingType === 'spotify'} onClick={()=>{disconnectAuth('spotify')}} fontWeight="100" backgroundColor="#1db954" color="white" borderRadius="100"  _hover={{backgroundColor:"#168d40"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Spotify {truncateAddress(bridgeData?.spotify)}
                      </Button>
                    ) : (
                      <Button onClick={spotifyAuth} fontWeight="100" backgroundColor="#1db954" color="white" borderRadius="100" _hover={{backgroundColor:"#168d40"}}>
                        <SpotifyIcon boxSize={5} mr={4}/>
                        Log in with Spotify
                      </Button>
                    )
                  }
                  <br/>
                  {
                    Boolean(bridgeData?.twitch) !== false ? (
                      <Button isLoading={loadingType === 'twitch'} onClick={()=>{disconnectAuth('twitch')}} fontWeight="100" backgroundColor="#9147ff" color="white" borderRadius="100"  _hover={{backgroundColor:"#5b26ab"}}>
                        <DisconnectIcon boxSize={4} mr={2} />
                        Twitch {bridgeData?.twitch}
                      </Button>
                    ) : (
                      <Button onClick={twitchAuth} fontWeight="100" backgroundColor="#9147ff" color="white" borderRadius="100" _hover={{backgroundColor:"#5b26ab"}}>
                        <TwitchIcon boxSize={5} mr={4}/>
                        Log in with Twitch
                      </Button>
                    )
                  }
                </Flex>
              ) : (<></>)
            }
          </Flex>
        </Flex>
    </>
  )
}
