import React from "react";
import { AdjustOutlined, HomeOutlined, Payments } from "@mui/icons-material";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import LockClockIcon from "@mui/icons-material/LockClock";

export const airdropRoutes: string[] = ["airdrop"];

export const stakingRoutes: string[] = ["staking"];

export const settingRoutes: string[] = ["setting"];
export const dashboardRoutes: string[] = ["create-asa"];
// The commented out tabs are for future use

export const dashboardTabs = [
  {
    label: "CreateASA",
    value: "create-asa",
    icon: <CoffeeMakerIcon></CoffeeMakerIcon>,
  },
  /*
  {
    label: "Contracts Overview",
    value: "overview",
    icon: <HomeOutlined></HomeOutlined>,
  },
  */
  /*
  {
    label: "Lockup Config",
    value: "airdrop",
    icon: <LockClockIcon></LockClockIcon>,
  },
  {
    label: "Earn Block Rewards",
    value: "stake",
    icon: <AdjustOutlined></AdjustOutlined>,
  },
  */
  /*
  {
    label: "Staking Program",
    value: "staking",
    icon: <LockClockIcon></LockClockIcon>,
  },
  */
  /*
  {
    label: "Deposit",
    value: "deposit",
    icon: <AdfScannerOutlined></AdfScannerOutlined>,
  },
  {
    label: "Withdraw",
    value: "withdraw",
    icon: <Payments></Payments>,
  },
  {
    label: "Transfer",
    value: "transfer",
    icon: <MoveDown></MoveDown>,
  },
  {
    label: "Delegate",
    value: "delegate",
    icon: <SupervisorAccount></SupervisorAccount>,
  },
  */
];
