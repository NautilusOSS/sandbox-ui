import "./CreateASA.scss";
import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import { useWallet } from "@txnlab/use-wallet-react";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
} from "@mui/material";
import { ShadedInput } from "@repo/theme";
import { LoadingTile, useSnackbar } from "@repo/ui";
import algosdk, {
  makeAssetCreateTxnWithSuggestedParamsFromObject,
  waitForConfirmation,
} from "algosdk";
import { useLoader } from "@repo/ui";
import voiStakingUtils from "@/utils/voiStakingUtils";
import TransactionDetails from "@/Components/TransactionDetails/TransactionDetails";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function CreateASA(): ReactElement {
  const { activeAccount, signTransactions } = useWallet();
  const { showSnack } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();
  const dispatch = useAppDispatch();

  const { loading } = useSelector((state: RootState) => state.node);

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(0);
  const [txnId, setTxnId] = useState<string>("");
  const [txnMsg, setTxnMsg] = useState<string>("");

  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    if (newValue === 0) {
      // Verification Token preset
      resetForm();
      setDecimals(0);
      setTotalSupply(1);
      setSymbol(""); // No symbol
    } else {
      // Custom Token preset
      resetForm();
    }
  };

  async function createAsset() {
    if (!activeAccount) {
      showSnack("Please connect your wallet", "error");
      return;
    }

    if (
      tabValue === 0 &&
      !name
      //(tabValue === 1 && (!name || !symbol || totalSupply <= 0))
    ) {
      showSnack("Please fill in all the required fields", "error");
      return;
    }

    if (tabValue === 1 && (!name || !symbol || totalSupply <= 0)) {
      showSnack("Please fill in all the required fields", "error");
      return;
    }

    const assetParams: any = {
      total: totalSupply * 10 ** decimals,
      decimals,
      defaultFrozen: false,
      unitName: symbol,
      assetName: name,
      manager: activeAccount.address,
      reserve: undefined,
      freeze: undefined,
      clawback: undefined,
    };

    try {
      showLoader("Creating asset...");
      const algodClient = voiStakingUtils.network.getAlgodClient();
      const suggestedParams = await algodClient.getTransactionParams().do();
      const txn = makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: activeAccount.address,
        ...assetParams,
        suggestedParams,
      });

      const signedTxn: any = await signTransactions([txn.toByte()]);
      if (!signedTxn) {
        showSnack("Failed to sign transaction", "error");
        return;
      }
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

      await algosdk.waitForConfirmation(algodClient, txId, 20);

      setTxnId(txId);
      setTxnMsg(`Asset ${name} created successfully!`);
      resetForm();
    } catch (e) {
      showSnack("Asset creation failed", "error");
    } finally {
      hideLoader();
    }
  }

  function resetForm() {
    setName("");
    setSymbol("");
    setTotalSupply(0);
    setDecimals(0);
  }

  return (
    <div className="create-asset-wrapper">
      <div className="create-asset-container">
        <div className="create-asset-header">
          <div>Create Algorand Standard Asset</div>
        </div>
        <div className="create-asset-body">
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Verification Token" />
            <Tab label="Custom" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {/* Verification Token fields (Pre-filled) */}
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth variant="outlined">
                <FormLabel className="classic-label">Asset Name</FormLabel>
                <ShadedInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <FormLabel className="classic-label">Decimals</FormLabel>
                  <ShadedInput value={decimals} disabled fullWidth />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <FormLabel className="classic-label">Total Supply</FormLabel>
                  <ShadedInput value={totalSupply} disabled fullWidth />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Custom Token fields (All fields editable) */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <FormLabel className="classic-label">Asset Name</FormLabel>
                  <ShadedInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <FormLabel className="classic-label">Asset Symbol</FormLabel>
                  <ShadedInput
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <FormLabel className="classic-label">Decimals</FormLabel>
                  <ShadedInput
                    value={decimals}
                    onChange={(e) => setDecimals(Number(e.target.value))}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <FormLabel className="classic-label">Total Supply</FormLabel>
                  <ShadedInput
                    value={totalSupply}
                    onChange={(e) => {
                      if (!Number.isNaN(Number(e.target.value))) {
                        setTotalSupply(Number(e.target.value));
                      }
                    }}
                    fullWidth
                  />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Button
                variant={"contained"}
                color={"primary"}
                fullWidth
                size={"large"}
                onClick={createAsset}
              >
                Create Asset
              </Button>
            </Grid>
          </Grid>

          <TransactionDetails
            id={txnId}
            show={Boolean(txnId)}
            onClose={() => {
              setTxnId("");
            }}
            msg={txnMsg}
          ></TransactionDetails>
        </div>
      </div>
    </div>
  );
}

export default CreateASA;
