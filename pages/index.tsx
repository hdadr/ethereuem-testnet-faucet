import { SyntheticEvent, useState } from "react";
import { Alert, Link, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ReceiveForm from "../components/ReceiveForm";
import DonateForm from "../components/DonateForm";
import styles from "../styles/Home.module.css";
import TestnetAddressInfo from "../components/TestnetAddressInfo";
import WalletConnector from "../components/WalletConnector";
import { useEagerConnect } from "../hooks/useEagerConnect";

export default function Home() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  useEagerConnect();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.walletConnector}>
          <Box sx={{ marginTop: 1, marginRight: 1, marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <WalletConnector connectText="Connect" />
          </Box>
        </div>

        <div className={styles.testnetInfo}>
          <TestnetAddressInfo />
        </div>

        <div className={styles.faucetForms}>
          <Box
            sx={{
              bgcolor: "opaqueBg",
              display: "flex",
              flexDirection: "column",
              padding: 2,
              height: 350,
              width: 520,
              borderRadius: 5,
              position: "relative",
            }}>
            <Tabs sx={{ paddingBottom: 3 }} value={tab} onChange={handleTabChange}>
              <Tab label="Receive testnet eth" />
              <Tab label="Donate testnet eth to faucet" />
            </Tabs>
            {tab === 0 && <ReceiveForm />}
            {tab === 1 && <DonateForm />}
          </Box>
        </div>

        <div className={styles.alert}>
          <Alert
            severity="warning"
            sx={{
              bgcolor: "opaqueBg",
              borderRadius: 5,
              marginLeft: 2,
              marginRight: 2,
            }}>
            Keep in mind, there is no economic value of the testnet ether. No point of hoarding it. It is usefull for building and testing
            applications on test networks.
          </Alert>
        </div>

        <div className={styles.imageSource}>
          <Typography variant="caption" sx={{ padding: 2 }}>
            Image:{" "}
            <Link color="secondary" href="https://ethereum.org/en/assets/" target="_blank">
              Ethereum.org
            </Link>
          </Typography>
        </div>
      </div>
    </>
  );
}
