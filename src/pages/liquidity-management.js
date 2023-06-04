import React from 'react';
import styles from "../styles/InstructionsComponent.module.css";

function LiquidityManagementPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
          <h1>
            <span>Liquidity Management</span>
          </h1>
          <p>
            Managing Liquidity on Uniswap V3 {" "}
          </p>
      </header>
    </div>
  );
}

export default LiquidityManagementPage;
