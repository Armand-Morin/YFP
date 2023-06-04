import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";


export default function Navbar() {
	return (
		<nav className={styles.navbar}>
			<a href="/">
				<img className={styles.alchemy_logo} src="/yf.png" style={{ width: "200px", height: "82px" }}></img>
			</a>
			<a className={styles.container} href="/whitepaper">Whitepaper</a>
			<ConnectButton accountStatus="address"></ConnectButton>
		</nav>
	);
}
