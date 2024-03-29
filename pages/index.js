import React, { useContext, useEffect, useRef, useState } from "react";
import { Flex, Button, Heading, Text, useDisclosure, Input, Progress, IconButton } from "@chakra-ui/react";
import TelegramLoginButton from 'react-telegram-login';
import { RainbowContext } from "@/contexts/RainbowContext";
import { AadharIcon, DiscordIcon, SlackIcon, SpotifyIcon, TelegramIcon, TwitchIcon, WorldcoinIcon, ZoomIcon } from "@/public/icons";
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
import BiometricButton from "@/components/BiometricButton";
import CardShell from "@/components/CardShell";
import { Wrap } from "@chakra-ui/react";
import CardShell2 from "@/components/CardShell2";
import Image from "next/image";
import SimpleButton from "@/components/SimpleButton";

import { getSession, useSession } from 'next-auth/react';
import Shell from "@/components/PageShell";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  }
}


export default function Home() {
  const { data: session, status} = useSession();

  const { signerAddress } = useContext(RainbowContext);

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
    await sendData('/api/bridge?type=telegram', response, "POST");
    let data = await fetch('/api/bridge?address='+signerAddress).then(data=>{return data.json()});
    setBridgeData(data);
    console.log(data);
    setLoadingType('');
  };

  const disconnectAuth = async (type) => {
    setLoadingType(type);
    await sendData('/api/bridge?type='+type, {}, "DELETE");
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


  async function refreshBridgeData(){
    if (isAddress(signerAddress) === true) {
      let data = await fetch('/api/bridge').then(data=>{return data.json()});
      setBridgeData(data);
      console.log(data);
    }
  }

  useEffect(() => {
    if (status==="authenticated") refreshBridgeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, signerAddress]);

  if (!session){
    return (
      <Shell>
        <Heading as="h4" size="md">Get started by,<br/> Connecting your Wallet</Heading>
      </Shell>
    )
  }
  else {
    if (status == "unauthenticated" || status == "loading") {
      return (
        <Shell>
          <Heading as="h4" size="md">
            Signing you in.
          </Heading>
        </Shell>
      )
    }
    else {
      return (
        <Shell>
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
                        <Image width='250px' height="20px" src={`data:image/jpeg;base64,${aadharData?.captchaBase64String}`} style={{height: "40px"}}/>
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
          {
            signerAddress !== "" && Boolean(bridgeData) === true ? (
              <Wrap width="100%" justify='center'>
                <BiometricButton bridgeData={bridgeData} refreshBridgeData={refreshBridgeData}/>
                <CardShell accent="#FF9933" icon={ <AadharIcon boxSize={9} />} title="Aadhaar">
                  {
                    Boolean(bridgeData?.aadharData) !== false ? (
                      <SimpleButton
                        isLoading={loadingType === 'aadhar'}
                        onClick={()=>{disconnectAuth('aadhar')}}
                        accent="#0088CC"
                      >
                          {bridgeData?.aadharData?.uidNumber}
                      </SimpleButton>
                    ) : (
                      <SimpleButton onClick={()=>{
                        updateCaptcha();
                        onOpen();
                      }} accent="#FF9933" >
                        Connect
                      </SimpleButton>
                    )
                  }
                </CardShell>
                <CardShell2
                  icon={ <WorldcoinIcon boxSize={6} />}
                  title="Worldcoin"
                  cardKey="worldcoin"
                  authFn={()=>{
                    window.open(`https://developer.worldcoin.org/hosted/wid_staging_e580f222d9fc791f8d8ef2e6b3e33d25?signal=${signerAddress}`, '_blank')
                  }}
                  accent='#183c4a'
                  bridgeData={bridgeData}
                  disconnectAuth={disconnectAuth}
                  loadingType={loadingType}
                />

                <CardShell accent='#0088CC' icon={ <TelegramIcon boxSize={9} />} title="Telegram">
                  {
                    Boolean(bridgeData?.telegram) !== false ? (
                      <SimpleButton
                        isLoading={loadingType === 'telegram'}
                        onClick={()=>{disconnectAuth('telegram')}}
                        accent="#0088CC"
                        type="disconnect"
                      >
                        {bridgeData?.telegram}
                      </SimpleButton>
                    ) : (
                      <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="Convospacebot" />
                    )
                  }
                </CardShell>
                <CardShell2
                  icon={ <SlackIcon boxSize={5} />}
                  title="Slack"
                  cardKey="slack"
                  authFn={slackAuth}
                  accent='#4a154b'
                  bridgeData={bridgeData}
                  disconnectAuth={disconnectAuth}
                  loadingType={loadingType}
                />
                <CardShell2
                  icon={ <DiscordIcon boxSize={6} />}
                  title="Discord"
                  cardKey="discord"
                  authFn={discordAuth}
                  accent='#5865f2'
                  bridgeData={bridgeData}
                  disconnectAuth={disconnectAuth}
                  loadingType={loadingType}
                />
                <CardShell2
                  icon={ <ZoomIcon boxSize={10} />}
                  title="Zoom"
                  cardKey="zoom"
                  authFn={zoomAuth}
                  accent='#0e71eb'
                  bridgeData={bridgeData}
                  disconnectAuth={disconnectAuth}
                  loadingType={loadingType}
                />
                <CardShell2
                  icon={ <SpotifyIcon boxSize={7} />}
                  title="Spotify"
                  cardKey="spotify"
                  bridgeData={bridgeData}
                  authFn={spotifyAuth}
                  disconnectAuth={disconnectAuth}
                  loadingType={loadingType}
                  accent='#1db954'
                />
                <CardShell2
                  icon={ <TwitchIcon boxSize={6} />}
                  title="Twitch"
                  cardKey="twitch"
                  authFn={twitchAuth}
                  accent='#6441a5'
                  bridgeData={bridgeData}
                  disconnectAuth={disconnectAuth}
                  loadingType={loadingType}
                />
              </Wrap>
            ) : (<></>)
          }
        </Shell>
      )
    }
  }
}
