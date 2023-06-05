import { ConnectButton } from '@rainbow-me/rainbowkit';
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react";

import React, { useState, useEffect } from "react";
import { StakingContract } from "./abi/abi.js";
import styles from "./styles/Home.module.css";
import yfLogo from "./styles/logo.svg"
import Web3 from "web3";
import "./styles/App.css";

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x30Af08187a4E05D62edaBb01e70C6B74040a31c2";
const contractInstance = new web3.eth.Contract(StakingContract, contractAddress);

function App() {
  const [number, setNumber] = useState(0);
  const [withdrawNumber, setWithdrawNumber] = useState(0);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [metadata, setMetadata] = useState("");
  const [symbol, setSymbol] = useState("");
  const [stakingTxHash, setStakingTxHash] = useState("");
  const [withdrawTxHash, setWithdrawTxHash] = useState("");

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];
        const metadata = await contractInstance.methods.Metadata(account).call();
        setMetadata(metadata);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBalance = async () => {
      try {
        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];
        const balance = await contractInstance.methods.balanceOf(account).call();
        setBalance(balance);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSymbol = async () => {
      try {
        const symbol = await contractInstance.methods.symbol().call();
        setSymbol(symbol);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMetadata();
    fetchBalance();
    fetchSymbol();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];
      setAddress(account);
    } catch (error) {
      console.error(error);
    }
  };

  const numberStake = async (event) => {
    event.preventDefault();
    const stakeValue = Number(number);
  
    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    const gas = await contractInstance.methods.stake().estimateGas({
      from: account,
      value: web3.utils.toWei(stakeValue.toString(), "ether"),
    });

    const transaction = contractInstance.methods.stake().send({
      from: account,
      value: web3.utils.toWei(stakeValue.toString(), "ether"),
      gas,
    });

    transaction
      .on("transactionHash", (hash) => {
        setStakingTxHash(hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          // Staking confirmed, you can perform any additional actions here
        }
      })
      .on("error", (error) => {
        console.error(error);
      });

    setNumber(0);
  };

  const numberWithdraw = async (event) => {
    event.preventDefault();
    const withdrawTokenId = Number(withdrawNumber);

    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];

    const gas = await contractInstance.methods
      .withdraw(withdrawTokenId)
      .estimateGas({
        from: account,
      });

    const transaction = contractInstance.methods
      .withdraw(withdrawTokenId)
      .send({
        from: account,
        gas,
      });

    transaction
      .on("transactionHash", (hash) => {
        setWithdrawTxHash(hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          // Withdrawal confirmed, you can perform any additional actions here
        }
      })
      .on("error", (error) => {
        console.error(error);
      });

    setWithdrawNumber(0);
  };

  return (
    <ThirdwebProvider>
      <div className={styles.main}>
      <header className={styles.navbar}>
          <img className={styles.alchemy_logo} src={yfLogo} style={{ width: "150px" }}></img>
          <a className={styles.container} href="/whitepaper"><strong>Whitepaper</strong></a>
          <div className={styles.container}>
						<a className={styles.container} href="https://github.com/Armand-Morin/YFP"
							 target={"_blank"}>
							<strong>Leave a star on Github</strong>
						</a>
					</div>
          <ConnectWallet
            onConnect={connectWallet}
            render={({ loading, connect }) => (
              <ConnectButton onClick={connect} disabled={loading}>
                Connect Wallet
              </ConnectButton>
            )}
          />
      
      </header>
      
        <div className="card">
          <header className={styles.header_container}>
          <h1>
            <span>YieldForge Protocol</span>
          </h1>
          <p>
            Start exploring our strategies{" "}
          </p>
        </header>
          
          <div className="forms-container">
            <form className="form" onSubmit={numberStake}>
              <p className={styles.description}>
              <strong>Amount of MATIC to stake:</strong>
                <input
                  className={styles.input_box}
                  type="number"
                  value={number}
                  onChange={(event) => setNumber(event.target.value)}
                />
              </p>
              <button className={styles.button} type="submit"><strong>Stake!</strong></button>
              </form>
            <br />
            <form className="form" onSubmit={numberWithdraw}>
              <p className={styles.description}>
              <strong>Withdraw (Enter NFT id):</strong>
                <input
                  className={styles.input_box}
                  type="number"
                  value={withdrawNumber}
                  onChange={(event) => setWithdrawNumber(event.target.value)}
                />
              </p>
              <button className={styles.button} type="submit"><strong>Unstake!</strong></button>
            </form>
          </div>
        </div>
        <div className={styles.grid}>
          <a className={styles.card}>
            <h2>Staked token balance</h2>
            <p>{balance}</p>
          </a>
          <a className={styles.card}>
            <h2>Token Symbol:</h2>
            <p>{symbol}</p>
          </a>
          <a className={styles.card}>
            <strong>Token ID:</strong> {metadata.tokenId}
          </a>
          <a className={styles.card}>
            <strong>Description Pairs:</strong>{" "}
            {JSON.stringify(metadata.description_pairs)}
          </a>
          <a className={styles.card}>
            <strong>Amount:</strong> {metadata.amount / 10 ** 18} MATIC
          </a>
          <a className={styles.card}>
            <strong>Time Minted:</strong>{" "}
            {new Date(metadata.time_minted * 1000).toLocaleString()}
          </a>
        </div>
        {stakingTxHash && (
          <div>
            <p>
              Staking TX on Mumbai:{" "}
              <a
                href={`https://mumbai.polygonscan.com/tx/${stakingTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {stakingTxHash}
              </a>
            </p>
          </div>
        )}
        {withdrawTxHash && (
          <div>
            <p>
              Withdraw TX on Mumbai:{" "}
              <a
                href={`https://mumbai.polygonscan.com/tx/${withdrawTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {withdrawTxHash}
              </a>
            </p>
          </div>
        )}
      </div>
    </ThirdwebProvider>
  );
  }
  export default App;