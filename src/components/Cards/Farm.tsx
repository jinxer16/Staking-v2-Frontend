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
import DepositDao from "components/Modals/DepositDao";
import WithdrawDao from "components/Modals/WithdrawDao";

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
  const depositDaoRef = useRef(null);
  const withdrawDaoRef = useRef(null);
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

  console.log(pool)

  return (
    <CardDiv className="mycard farmpoolcard">
      {/* @ts-ignore */}
      <Deposit name={pool.name} ref={depositRef} />
      {/* @ts-ignore */}
      <Withdraw name={pool.name} ref={withdrawRef} />
      {/* @ts-ignore */}
      <DepositDao name={pool.name} ref={depositDaoRef} />
      {/* @ts-ignore */}
      <WithdrawDao name={pool.name} ref={withdrawDaoRef} />
      <header>
        <div className="headertop">
          <div className="headerinfo">
            <img
              src={pool.logo}
              className={isLpPool === false ? "isnotpool" : `ispool`}
              alt=""
            />
            <div>
              <h5>{pool.name}</h5>
            </div>
          </div>

          <div>
            <h6>Earn {pool.stakeTokenSymbol}</h6>
          </div>
        </div>

        <div className="stakinginfo">
          <div>
            APY <b>{rewardRateInNum > 0 ? aprInNumFormatted : "NaN"} %</b>
          </div>
          <div className="totalStaked">
            Total Staked{" "}
            <b>
              {totalStaked} {pool.stakeTokenSymbol}
            </b>
          </div>
          {pool.depositFee ? (
            <div
              style={
                pool.depositFee.toString() === "0"
                  ? { opacity: 1 }
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

              {pool.stakeTokenSymbol === "FIBODAO" && (
              <div className="daocontrols">
                <button
                  onClick={() => {
                    depositDaoRef.current.openModal();
                  }}
                  className="plusminus"
                >
                  + Get DAO
                </button>
                <button
                  onClick={() => {
                    withdrawDaoRef.current.openModal();
                  }}
                  className="plusminus"
                >
                  - Repay DAO
                </button>
              </div>
            )}
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
              className="address"
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

    .contentfetched{
      width: 100%;
      height: 100%;
      /* background: lightblue; */

      .infos{
        b{
          font-size: 25px !important;
        }
      }

      .controls{
        .daocontrols{
          display: flex;
          justify-content: center;
          .plusminus{
            border: 2px #d2d1d2 solid !important;
            color: black !important;
          }
        }
      }
    }

  .totalStaked{
    text-align: left;

    b{
      /* text-align: right; */
    }
  }

  .fee{
    margin-bottom: 1rem !important;
  }

  // width:40%;
  background: #fff;
  color: #141414;
  border-radius: 30px;
  padding: 0.5rem 1rem;
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
      color: #141414 !important;
    }
    .headerinfo {
      h5 {
        span {
          background-color: #6b67ef !important;
          color: #141414;
        }
      }
    }
    .content {
      button {
        border: 2px solid #6b67ef;
        color: #141414;
      }
    }
    .copybutton {
      input,
      i {
        color: #141414;
        font-weight: 300;
      }



    }
  }
  header {
    // align-items:center;
    padding: 18px 16px;
    color: #141414;
    position: relative;
    border-bottom: 2px solid rgb(56, 50, 65);
    // align-items: center;
    min-height: 122px;

    .headertop{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .headerinfo {
      display: flex;
      align-items:center;
      img {
        &.isnotpool {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          /* border: 3px solid #d2d2d2; */
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
        color: #141414;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        margin-top: 4px;
        margin-bottom: 6px;
        display: flex;
        span {
          border-radius: 8px;
          background-color: #D9D9D9;
          font-size: 12px;
          // font-weight:bold;
          padding: 8px 16px;
          margin-top: 3px;
        }
      }
      h6 {
        color: #141414;
        font-size: 14px;
        font-weight: 400;
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

    .stakinginfo {
      display: flex;
      justify-content: space-between;
      margin: 10px 0 5px 0;
      // height:160px;
      div {
        font-weight: 400;
        margin: 3px 0;
        font-size: 14px;
        text-align: center;
        width: 33%;
      }
      b {
        color: #141414;
        font-weight: 600;
        display: block;
        font-size: 25px;
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

  .address{
    font-weight: 400 !important;
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
    font-weight: 200;
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
        color: #141414;
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
        color: #000;
        font-weight: 500;
        background: #D9D9D9;
        cursor: pointer;

        &:hover{
          background: #B1B1B1;
        }
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
            color: #141414;
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
          color: #000;
          &:first-child {
            border: 3px solid rgb(224, 14, 139);
            color: #fff;
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
          color: #000;
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
