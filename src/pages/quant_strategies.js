/*
import React, { useState } from "react";
import { SimpleStorage } from "../abi/abi.js";
import Web3 from "web3";
import styles from "../styles/App.module.css";

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);
// Contract address of the deployed smart contract
const contractAddress = "0xb22D5A8F226262CAF376bA123342F8f3eeCdb463";
const storageContract = web3.eth.Contract(SimpleStorage, contractAddress);

function App() {
  // Hold variables that will interact with our contract and frontend
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("0");
  
  const numberSet = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    // Get permission to access user funds to pay for gas fees
    const gas = await storageContract.methods.set(number).estimateGas();
    const post = await storageContract.methods.set(number).send({
      from: account,
      gas,
    });
  };

  const numberGet = async (t) => {
    t.preventDefault();
    const post = await storageContract.methods.get().call();
    setGet(post);
  };
  
  return (
     <div className={styles.main}>
       <div className={styles.card}>
         <form className={styles.form} onSubmit={numberSet}>
           <label>
             Set your uint256:
             <input
               className="input"
               type="text"
               name="name"
               onChange={(t) => setUint(t.target.value)}
             />
           </label>
           <button className={styles.button} type="submit" value="Confirm">
             Confirm
           </button>
         </form>
         <br />
         <button className={styles.button} onClick={numberGet} type="button">
           Get your uint256
         </button>
         {getNumber}
       </div>
     </div>
  );
}

export default App;
*/

import React from 'react';

function StPage() {
  return (
    <div>
      <h1>Staking</h1>
      <p>This is the Staking page.</p>
    </div>
  );
}

export default StPage;
