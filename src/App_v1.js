import React, { useState, useEffect } from "react";
import { StakingContract } from "./abi/abi.js";
import Web3 from "web3";
import "./App.css";

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x1359dffc4b2223Fcac5064234863eF04ae526eDC";
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
    <div className="main">
      <div className="card">
        <div>
          {!address ? (
            <button className="button" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <p>Connected Wallet Address: {address}</p>
          )}
        </div>
        <form className="form" onSubmit={numberStake}>
          <label>
            Stake your ETH tokens:
            <input
              className="input"
              type="text"
              name="name"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
            />
          </label>
          <button className="button" type="submit" value="Confirm">
            Confirm
          </button>
        </form>
        <br />
        <form className="form" onSubmit={numberWithdraw}>
          <label>
            Withdraw your tokens:
            <input
              className="input"
              type="text"
              name="name"
              value={withdrawNumber}
              onChange={(event) => setWithdrawNumber(event.target.value)}
            />
          </label>
          <button className="button" type="submit">
            Confirm
          </button>
        </form>
        <p>Token Balance: {balance}</p>
        <p>Metadata:</p>
        <ul>
        <p><strong>Token ID:</strong> {metadata.tokenId}</p>
        <p><strong>Description Pairs:</strong> {JSON.stringify(metadata.description_pairs)}</p>
        <p><strong>Amount:</strong> {metadata.amount / (10**18)} ETH</p>
        <p><strong>Time Minted:</strong> {new Date(metadata.time_minted * 1000).toLocaleString()}</p>
        </ul>
        <p>Token Symbol: {symbol}</p>
        {stakingTxHash && (
          <div>
            <p>
              Staking TX on Etherscan:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${stakingTxHash}`}
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
              Withdraw TX on Etherscan:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${withdrawTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {withdrawTxHash}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

           
