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
      if (approveStatus === 1) {
        toast.success("Approved successfully!");
      }
      setPendingApproveTx(false);
    } catch (e) {
      console.error(e);
      toast.error("Approve failed!");
    }
  }, [onApprove]);

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
  }, [onClaim]);

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
    <CardDiv className="mycard farmpoolcard">
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
            <h5>{pool.name}</h5>
            <h6>Earn {pool.stakeTokenSymbol}</h6>
            <h5>
              {pool.depositFee && pool.depositFee.toString() === "0" ? (
                <span>No Fees</span>
              ) : null}
            </h5>
          </div>
        </div>
        <div className="right">
          <div>
            APY <b>{rewardRateInNum > 0 ? aprInNumFormatted : "NaN"} %</b>
          </div>
          <div>
            Total Staked{" "}
            <b>
              {totalStaked} {pool.stakeTokenSymbol}
            </b>
          </div>
          {pool.depositFee ? (
            <div
              style={
                pool.depositFee.toString() === "0"
                  ? { opacity: 0.5 }
                  : { opacity: 1 }
              }
            >
              Deposit Fee <b>{getBalanceNumber(pool.depositFee, 2)}%</b>
            </div>
          ) : null}
          {withdrawLocked ? (
            <div>
              Withdraw Available At <b>{withdrawTimestamp.toDateString()}</b>
            </div>
          ) : null}
        </div>
      </header>
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
              <button
                onClick={() => {
                  depositRef.current.openModal();
                }}
                className="plusminus"
              >
                + Deposit
              </button>
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

            {pool.stakeTokenSymbol === "FIBODAO" && (
              <div className="daocontrols">
                <button
                  onClick={() => {
                    depositRef.current.openModal();
                  }}
                  className="plusminus"
                >
                  + Get DAO
                </button>
                <button
                  onClick={() => {
                    withdrawRef.current.openModal();
                  }}
                  className="plusminus"
                  disabled={withdrawLocked}
                >
                  - Repay DAO
                </button>
              </div>
            )}
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
        <div className="copybutton">
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
        </div>
      </footer>
    </CardDiv>
  );
};
const CardDiv = styled.div`
  // width:40%;
  background: #131723;
  color: #fff;
  border-radius: 14px;
  overflow: hidden;
  &.farmpoolcard {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &.specialpool {
    border: 2px solid #cbcaf9;
    .plusminus {
      color: #23262f !important;
    }
    .headerinfo {
      h5 {
        span {
          background-color: #6b67ef !important;
          color: #fff;
        }
      }
    }
    .content {
      button {
        background-color: #6b67ef;
        border: 2px solid #6b67ef;
        color: #fff;
      }
    }
    .copybutton {
      input,
      i {
        color: #6b67ef;
      }
    }
  }
  header {
    display: flex;
    justify-content: space-between;
    // align-items:center;
    padding: 18px 16px;
    color: #fff;
    position: relative;
    border-bottom: 2px solid rgb(56, 50, 65);
    // align-items: center;
    min-height: 122px;
    .headerinfo {
      display: flex;
      // align-items:center;
      img {
        &.isnotpool {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 3px solid #d2d2d2;
          margin-right: 10px;
        }
        &.ispool {
          width: 80px;
          height: 80px;
          margin: 0 -10px 0 -20px;
        }
      }
      .poolimg {
        display: flex;
        flex-direction: column;
        img {
          height: 44px;
          width: auto;
          border-radius: 50%;
          border: 2px solid rgb(56, 50, 65);
          box-shadow: 0 0 0 2px #d2d2d2;
          margin-right: 10px;
          &:last-child {
            margin-top: -5px;
          }
        }
      }
      h5 {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        margin-top: 4px;
        margin-bottom: 6px;
        display: flex;
        span {
          border-radius: 8px;
          background-color: #f1ad2b;
          font-size: 10px;
          // font-weight:bold;
          padding: 4px 8px;
          margin-top: 3px;
        }
      }
      h6 {
        color: rgb(184, 173, 210);
        font-size: 14px;
        font-weight: 600;
        margin: 0;
      }
      a {
        color: #f1ad2c;
        font-weight: bold;
        font-size: 12px;
        margin-top: 10px;
        display: block;
      }
    }
    .right {
      text-align: right;
      // height:160px;
      div {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        margin: 3px 0;
        font-size: 14px;
      }
      b {
        color: rgb(184, 173, 210);
        margin-left: 14px;
        font-weight: 700;
      }
    }
    @media screen and (max-width: 1250px) {
      flex-direction: column;
      .headerinfo {
        position: relative;
        a {
          position: absolute;
          right: 0px;
          top: 50%;
          transform: translateY(-50%);
          margin: 0;
        }
        .poolimg {
          flex-direction: row;
          img {
            &:last-child {
              margin-top: 0;
              margin-left: -16px;
            }
          }
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 18px 16px;
    color: #777e90;
    position: relative;
    border-top: 2px solid rgb(56, 50, 65);
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    position: relative;
    .pairbuttonouter {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      a {
        overflow: hidden;
        display: block;
        color: #fff;
        font-size: 14px;
        min-width: unset;
        padding: 7px 10px;
        text-decoration: none;
        border: 2px solid rgb(56, 50, 65);
        background: transparent;
        border-radius: 10px;
        .lg {
          height: 14px;
          width: auto;
          margin-right: 4px;
        }
        .bg {
          position: absolute;
          right: 0;
          top: 0;
          z-index: -1;
          border-top-right-radius: 10px;
        }
      }
    }
    @media screen and (max-width: 1350px) {
      .pairbuttonouter {
        position: Relative;
        left: 0px;
        top: 0%;
        transform: translateY(0%);
        margin: 0 0 10px;
      }
    }
    .copybutton {
      display: flex;
      align-items: center;
      input {
        border: 0;
        outline: 0;
        padding: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 140px;
        background: transparent;
        color: rgb(224, 14, 139);
        font-weight: bold;
        font-size: 15px;
        cursor: pointer;
      }
      i {
        margin-left: 8px;
        color: rgb(224, 14, 139);
        cursor: pointer;
      }
    }
    a {
      color: rgb(224, 14, 139);
      font-weight: bold;
      font-size: 15px;
      margin-top: 0px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }

  .content {
    padding: 16px 30px;
    height: 30vh;
    display: flex;
    align-items: center;
    min-height: 200px;
    max-height: 300px !important;
    button {
      font-size: 14px;
    }
    .approve {
      width: 100%;

      button {
        margin: auto;
        display: block;
        padding: 8px 40px;
        color: #fff;
      }
    }
    .contentfetched {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      width: 100%;
      .infos {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .info_single {
          padding-right: 20px;
          margin-right: 20px;
          border-right: 2px solid rgb(56, 50, 65);
          color: #777e90;
          &:first-child {
            width: calc(50% - 5px);
          }
          &:last-child {
            padding-right: 0px;
            margin-right: 0px;
            border-right: 0;
          }
          b {
            color: #fff;
            font-size: 17px;
            font-weight: 500;
          }
          h6 {
            margin-bottom: 4px;
          }
          div {
            font-weight: 600;
          }
        }
      }

      .plusminus {
        background: transparent;
        border: 2px solid #d2d2d2;
        margin-left: 6px;

        &:disabled {
          border: 2px solid #d2d2d2;
          color: #777e90;
        }
      }
      .controls {
        margin-top: 20px;
        button {
          &:first-child {
            border: 3px solid rgb(224, 14, 139);
          }
          padding: 7px 16px;
          font-size: 12px;
          margin: 3px;
        }
        @media screen and (max-width: 400px) {
          display: flex;
          justify-content: center;
          flex-flow: wrap;
        }
      }
      .daocontrols {
        margin-top: 20px;
        button {
          padding: 7px 16px;
          font-size: 12px;
          margin: 3px;
        }
        @media screen and (max-width: 400px) {
          display: flex;
          justify-content: center;
          flex-flow: wrap;
        }
      }
    }
    @media screen and (max-width: 1500px) {
      min-height: 164px;
      padding: 16px 20px;
      .contentfetched {
        flex-direction: column;
        .controls {
          margin-top: 20px;
        }
      }
    }
    @media screen and (max-width: 500px) {
      .info_single {
        font-size: 13px;
        h6 {
          font-size: 13px;
        }
      }
    }
  }
`;

export default FarmCard;
