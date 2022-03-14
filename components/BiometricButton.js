import React, { useContext, useState } from "react";
import {  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Button } from "@chakra-ui/react";
import { BiometricIcon } from "@/public/icons";
import { Web3Context } from "@/contexts/Web3Context";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
const BiometricButton = ({bridgeData, refreshBridgeData}) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { signerAddress } = useContext(Web3Context);
  const [isLoading, setLoading] = useState(false);
  const [isTestLoading, setTestLoading] = useState(false);

  async function getChallengeData(){

    if (Boolean(bridgeData?.biometric?.device) === true) {
        onOpen();
    }
    else {
        setLoading(true);
        let data = await fetch(`/api/webauthn/startregister?ethAddress=${signerAddress}`);
        let json = await data.json();
        console.log('startreg', json);
        try {
            // Pass the options to the authenticator and wait for a response
            let attRes = await startRegistration(json);
            fetch('api/webauthn/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...attRes, ethAddress: signerAddress }),
            })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setLoading(false);
                refreshBridgeData();
                alert("Your account has been successfully registered", true);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
                alert("Registration failed");
            });

          } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Authentication with your security key failed");
          }
    }


  }
  async function testBiometric(){
    setTestLoading(true);
    fetch(`api/webauthn/startlogin?ethAddress=${signerAddress}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        startAuthentication(data)
          .then((attRes) => {
            fetch('api/webauthn/login', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...attRes, ethAddress: signerAddress }),
            })
              .then((res) => res.json())
              .then((result) => {
                console.log(result);
                setTestLoading(false);
                alert("Your account has been successfully authenticated");
              })
              .catch((e) => {
                console.log(e);
                setTestLoading(false);
                alert("Login failed");
              });
          })
          .catch((e) => {
            console.log(e);
            setTestLoading(false);
            alert("Authentication with your security key failed");
          });
      })
      .catch((e) => {
        console.log(e);
        setTestLoading(false);
        alert("Failed preparing for authentication");
        // alert(e.message)
      });

  }

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

  const disconnectAuth = async () => {
    setLoading(true);
    await sendData('/api/bridge?type=biometric&ethAddress='+signerAddress, {}, "DELETE");
    refreshBridgeData();
    setLoading(false);
  };

  return (
    <>
        <Modal isOpen={isOpen} onClose={()=>{
            setLoading(false);
            onClose();
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Biometric Verification</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Button onClick={testBiometric}>
                        Test Biometric
                    </Button>
                    <Button onClick={disconnectAuth}>
                        Disconnect Biometric
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
        <Button isLoading={isLoading} onClick={getChallengeData} fontWeight="100" backgroundColor="white" color="black" borderRadius="100" borderWidth="1px" borderColor="grey"  _hover={{backgroundColor:"#ddd"}}>
            <BiometricIcon boxSize={4} mr={2}/>
            {Boolean(bridgeData?.biometric?.device) === true ? "Biometric Verified" : "Log in with Biometric"}
        </Button>
    </>
  );
};

export default BiometricButton;
