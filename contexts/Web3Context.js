import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const Web3Context = React.createContext(undefined);

export const Web3ContextProvider = ({children}) => {

  const [web3Modal, setWeb3Modal] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState("");
  const [ensAddress, setEnsAddress] = useState("");

  useEffect(() => {

    const getAddress = async () => {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSignerAddress(ethers.utils.getAddress(address));
      let tp = new ethers.providers.InfuraProvider("mainnet","1e7969225b2f4eefb3ae792aabf1cc17");
      tp.lookupAddress(address).then((ensAdd)=>{
        if(Boolean(ensAdd) == true){
          setEnsAddress(ensAdd);
        }
      });

    }
    if (provider) {
      getAddress();
    }
    else {
      setSignerAddress("");
      setEnsAddress("");
    }

  }, [provider]);

  useEffect(() => {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "1e7969225b2f4eefb3ae792aabf1cc17"
        }
      }
    };

    let w3m = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      theme: "dark",
      providerOptions,
    })

    setWeb3Modal(w3m);

  }, []);

  async function connectWallet() {

    try {

      let modalProvider = await web3Modal.connect();

      if (modalProvider.on) {
        modalProvider.on("accountsChanged", () => {
          window.location.reload();
        });
        modalProvider.on("chainChanged", () => {
          window.location.reload();
        });
      }
      const ethersProvider = new ethers.providers.Web3Provider(modalProvider);

      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(ethersProvider);

      return address;

    } catch(e) {
      disconnectWallet();
      console.log('NO_WALLET_CONNECTED', e);
    }

  }

  function disconnectWallet() {
    web3Modal.clearCachedProvider();
    localStorage?.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
    setProvider(undefined);
    setSignerAddress("");
    setEnsAddress("");
  }

  return (
    <Web3Context.Provider value={{
      connectWallet,
      disconnectWallet,
      provider,
      signerAddress,
      ensAddress,
      web3Modal
    }}>
        {children}
    </Web3Context.Provider>
  )

}
