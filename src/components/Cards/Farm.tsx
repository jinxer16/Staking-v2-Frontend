import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { usePoolFromName, usePoolUser, useTokenPrice } from "state/hooks";
import { BASE_EXPLORER_URL, DEFAULT_CHAIN_ID, YEAR_DURATION } from "config";
import BigNumber from "bignumber.js";
import { getBalanceNumber } from "utils/formatBalance";
import { useWeb3React } from "@web3-react/core";
import { useApprove } from "hooks/useApprove";
import { useERC20 } from "hooks/useContracts";
import { toast } from "react-toastify";
import { useClaim } from "hooks/useClaim";
import Deposit from "components/Modals/Deposit";
import Withdraw from "components/Modals/Withdraw";
import "./farm.css"

interface CardValueProps {
  poolName: string;
  isLpPool: boolean;
}

const FarmCard: React.FC<CardValueProps> = ({ poolName, isLpPool }) => {
  const { account } = useWeb3React();
  const [pendingApproveTx, setPendingApproveTx] = useState(false);
  const [pendingClaimTx, setPendingClaimTx] = useState(false);
  const pool = usePoolFromName(poolName);
  const tokenPrice = useTokenPrice(
    pool.stakeTokenSymbol,
    false,
    DEFAULT_CHAIN_ID
  );
  const rewardTokenPrice = useTokenPrice(
    pool.rewardTokenSymbol,
    false,
    DEFAULT_CHAIN_ID
  );
  const stakeTokenContract = useERC20(pool.stakeToken[DEFAULT_CHAIN_ID]);
  const { onApprove } = useApprove(
    stakeTokenContract,
    pool.address[DEFAULT_CHAIN_ID]
  );
  const { onClaim } = useClaim(pool.address[DEFAULT_CHAIN_ID]);
  const depositRef = useRef(null);
  const withdrawRef = useRef(null);
  const textAreaRef = useRef(null);
  const handleApprove = useCallback(async () => {
    try {
      setPendingApproveTx(true);
      const approveStatus = await onApprove();
      if (approveStatus == 1) {
        toast.success("Approved successfully!");
      }
      setPendingApproveTx(false);
    } catch (e) {
      console.error(e);
      toast.error("Approve failed!");
    }
  }, [onApprove, account]);

  const handleClaim = useCallback(async () => {
    try {
      setPendingClaimTx(true);
      const claimStatus = await onClaim();
      if (claimStatus == 1) {
        toast.success("Claimed successfully!");
      }
      setPendingClaimTx(false);
    } catch (e) {
      console.error(e);
      toast.error("Claim failed!");
    }
  }, [onClaim, account]);

  const totalStakedInNum = getBalanceNumber(
    pool.totalSupply,
    pool.stakeTokenDecimal
  );
  const totalStakedInUsd = totalStakedInNum * tokenPrice;

  const rewardRate = pool.rewardRate;
  const rewardRateInNum = getBalanceNumber(rewardRate, pool.rewardTokenDecimal);

  const aprInNum =
    (rewardTokenPrice * rewardRateInNum * YEAR_DURATION * 100) /
    totalStakedInUsd;
  const aprInNumFormatted = aprInNum.toLocaleString(undefined, {
    maximumFractionDigits: 3,
  });
  const totalStaked = pool.totalSupply
    ? `${getBalanceNumber(
        pool.totalSupply,
        pool.stakeTokenDecimal
      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";
  const { allowance, stakedBalance, earned, lastDeposited } =
    usePoolUser(poolName);
  let isApproved =
    account && allowance && new BigNumber(allowance).isGreaterThan(0);
  if (account && pool.isNativePool) {
    isApproved = true;
  }

  const stakedInNum = getBalanceNumber(stakedBalance, pool.stakeTokenDecimal);
  const userStaked = stakedBalance
    ? `${stakedInNum.toLocaleString(undefined, { maximumFractionDigits: 5 })}`
    : "-";
  const stakedInUsd = stakedInNum * tokenPrice;
  const stakedInUsdFormatted = stakedInUsd
    ? `${stakedInUsd.toLocaleString(undefined, {
        maximumFractionDigits: 3,
      })} USD`
    : "0.000 USD";

  const earnedInNum = getBalanceNumber(earned, pool.rewardTokenDecimal);
  const userEarned = earned
    ? `${earnedInNum.toLocaleString(undefined, { maximumFractionDigits: 5 })}`
    : "-";
  const earnedInUsd = earnedInNum * rewardTokenPrice;
  const earnedInUsdFormatted = earnedInUsd
    ? `${earnedInUsd.toLocaleString(undefined, {
        maximumFractionDigits: 3,
      })} USD`
    : "0.000 USD";

  const curTimeStamp = Date.now() / 1000;
  const withdrawTimestamp = new Date(
    (lastDeposited + pool.lockingDuration) * 1000
  );
  const withdrawLocked = pool.lockingDuration
    ? pool.lockingDuration > 0 &&
      lastDeposited + pool.lockingDuration > curTimeStamp
    : false;

  return (
    <div className="approvalCard">
      {/* @ts-ignore */}
      <Deposit name={pool.name} ref={depositRef} />
      {/* @ts-ignore */}
      <Withdraw name={pool.name} ref={withdrawRef} />
      <header>
        <div className="headerinfo">
          <img
            src={pool.logo}
            className={isLpPool === false ? "isnotpool" : `ispool`}
            alt=""
          />
          <div>
            {/* <h5>{pool.name}</h5> */}
            <h6 className="earnCoin">Earn <span>{pool.stakeTokenSymbol}</span></h6>
            {/* <h5>
              {pool.depositFee && pool.depositFee.toString() === "0" ? (
                <span>No Fees</span>
              ) : null}
            </h5> */}
          </div>
        </div>
        <div className="right">
        {pool.depositFee ? (
            <div>
              Fees <b>{getBalanceNumber(pool.depositFee, 2)}%</b>
            </div>
          ) : null}

          <div>
            APY <b>{rewardRateInNum > 0 ? aprInNumFormatted : "NaN"} %</b>
          </div>

          <div className="">
            Length <b>3M</b>
          </div>
          
          {withdrawLocked ? (
            <div>
              Withdraw Available At <b>{withdrawTimestamp.toDateString()}</b>
            </div>
          ) : null}
        </div>
        <hr />
      </header>

      <div className="totalStaked">
        Total Staked{" "}
        <b>
          {totalStaked}
        </b>
      </div>

      <div className="content">
        {isApproved ? (
          <div className="contentfetched">
            <div className="infos">
              <div className="info_single">
                <h6>{pool.rewardTokenSymbol} Earned</h6>
                <b>{userEarned}</b>
                <div>{earnedInUsdFormatted}</div>
              </div>
              <div className="info_single">
                <h6>{pool.stakeTokenSymbol} Staked</h6>
                <b>
                  {userStaked} {pool.stakeTokenSymbol}
                </b>
                <div>{stakedInUsdFormatted}</div>
              </div>
            </div>
            <div className="controls">
              <button disabled={pendingClaimTx} onClick={handleClaim}>
                Collect
              </button>
              {pool.rewardTokenSymbol === "ORIO" && (
                <button
                  onClick={() => {
                    depositRef.current.openModal();
                  }}
                  className="plusminus"
                >
                  + Deposit
                </button>
              )}
              {/* <button onClick={() => {
                        depositRef.current.openModal()
                    }} className="plusminus">+ Deposit</button> */}
              <button
                onClick={() => {
                  withdrawRef.current.openModal();
                }}
                className="plusminus"
                disabled={withdrawLocked}
              >
                - Withdraw
              </button>
            </div>
          </div>
        ) : (
          <div className="approve">
            <button disabled={pendingApproveTx} onClick={handleApprove}>
              Approve
            </button>
          </div>
        )}
      </div>
      <footer>
        {/* <div className="copybutton">
          <a
            href={`${BASE_EXPLORER_URL}/address/${pool.address[DEFAULT_CHAIN_ID]}`}
            target="_blank"
          >
            <input
              ref={textAreaRef}
              type="text"
              value={pool.address[DEFAULT_CHAIN_ID]}
              readOnly
            />
          </a>
          <i
            className="fas fa-copy"
            onClick={() => {
              navigator.clipboard.writeText(textAreaRef.current.value);
            }}
          ></i>
        </div> */}
      </footer>
    </div>
  );
};

export default FarmCard;
