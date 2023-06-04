import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";

export default function InstructionsComponent() {

	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					<span>YieldForge Protocol</span>
				</h1>
				<p>
					Start exploring our strategies{" "}
				</p>
			</header>

			<div className={styles.buttons_container}>
            <form className="form" onSubmit={numberStake}>
              <p className={styles.description}>
                Amount of ETH to stake:
                <input
                  className={styles.textbox}
                  type="number"
                  value={number}
                  onChange={(event) => setNumber(event.target.value)}
                />
              </p>
              <Web3Button type="submit">Stake!</Web3Button>
            </form>
            <br />
            <form className="form" onSubmit={numberWithdraw}>
              <p className={styles.description}>
                Withdraw (Enter NFT id):
                <input
                  className={styles.textbox}
                  type="number"
                  value={withdrawNumber}
                  onChange={(event) => setWithdrawNumber(event.target.value)}
                />
              </p>
              <Web3Button type="submit">Unstake!</Web3Button>
            </form>
          	</div>

			<div className={styles.footer}>
				<div>
						<a
							href="https://github.com/Armand-Morin/YieldForge"
							target={"_blank"}
						>
							Hosted By Franklin Templeton
						</a>
					</div>
				<div className={styles.icons_container}>
					<div>
						<a
							href="https://github.com/Armand-Morin/YieldForge"
							target={"_blank"}
						>
							Leave a star on Github
						</a>
					</div>
					<div>
						<a
							href="https://github.com/Armand-Morin/YieldForge"
							target={"_blank"}
						>
							Follow us on Twitter
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
