import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { DEFAULT_CHAIN_ID } from "config";
import useRefresh from "hooks/useRefresh";
import { useStake } from "hooks/useStake";
import { useETHBalance, useTokenBalance } from "hooks/useTokenBalance";
import useWeb3Provider from "hooks/useWeb3Provider";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { usePoolFromName } from "state/hooks";
import { fetchPoolsUserDataAsync } from "state/pools";
import { getTokenBalance } from "utils/callHelpers";
import { getBalanceNumber, getDecimalAmount } from "utils/formatBalance";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    border: 0,
    borderRadius: "20px",
  },
};

const { forwardRef, useRef, useImperativeHandle } = React;

interface DepositModalProps {
  name: string;
}

const DepositDao: React.FC<DepositModalProps> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { fastRefresh } = useRefresh();

  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const provider = useWeb3Provider();
  const poolName = props.name;
  const pool = usePoolFromName(poolName);
  const { onStake } = useStake(pool.address[DEFAULT_CHAIN_ID]);

  const defaultEthBalance = useETHBalance();
  let defaultTokenBalance =
    Math.floor(useTokenBalance(pool.stakeToken[DEFAULT_CHAIN_ID]) * 100000) /
    100000;

  if (pool.isNativePool) {
    defaultTokenBalance = Math.floor(defaultEthBalance * 100000) / 100000;
  }

  const defaultTokenBalalnceFormatted = defaultTokenBalance
    ? `${defaultTokenBalance.toLocaleString(undefined, {
        maximumFractionDigits: 5,
      })} ${pool.stakeTokenSymbol}`
    : `0.000000000 ${pool.stakeTokenSymbol}`;

  const [tokenBalance, setTokenBalance] = React.useState(defaultTokenBalance);
  const [tokenBalanceFormatted, setTokenBalanceFormatted] = React.useState(
    defaultTokenBalalnceFormatted
  );

  useEffect(() => {
    if (account) {
      const fetchETHBalance = async (_account, _provider) => {
        const res = await _provider.getBalance(_account);
        setTokenBalance(
          Math.floor(
            getBalanceNumber(new BigNumber(res.toString()), 18) * 10000
          ) / 10000
        );
      };

      const fetchTokenBalance = async (_account, _tokenAddress) => {
        const res = await getTokenBalance(_account, _tokenAddress);
        setTokenBalance(Math.floor(res * 100000) / 100000);
      };

      if (pool.isNativePool) {
        fetchETHBalance(account, provider);
      } else {
        fetchTokenBalance(account, pool.stakeToken[DEFAULT_CHAIN_ID]);
      }
    }
  }, [fastRefresh, provider, account, pool]);

  useEffect(() => {
    const _tokenBalanceFormatted = tokenBalance
      ? `${tokenBalance.toLocaleString(undefined, {
          maximumFractionDigits: 5,
        })} ${pool.stakeTokenSymbol}`
      : `0.000000000 ${pool.stakeTokenSymbol}`;
    setTokenBalanceFormatted(_tokenBalanceFormatted);
  }, [tokenBalance, pool]);

  const [tokenAmount, setTokenAmount] = useState(0);
  const [pendingTx, setPendingTx] = useState(false);
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setIsOpen(true);
    },
  }));

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <Modal
      // parentSelector={() => document.querySelector('.farmpoolcard')}
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="claimmodelouter">
        <h4>Available Balance</h4>
        <h5>{tokenBalanceFormatted}</h5>
        <div className="buttonOuter">
          <input
            type="number"
            placeholder="0.00"
            value={tokenAmount}
            onChange={(e) => {
              setTokenAmount(parseFloat(e.target.value));
            }}
          />
          <button onClick={() => setTokenAmount(tokenBalance)}>MAX</button>
        </div>
        <button
          disabled={pendingTx}
          onClick={async () => {
            if (tokenAmount <= tokenBalance) {
              const tokenAmountInBigNum = getDecimalAmount(
                new BigNumber(tokenAmount),
                pool.stakeTokenDecimal
              );
              console.info(tokenAmountInBigNum.toString());
              try {
                setPendingTx(true);
                let stakeStatus = 0;
                if (pool.isNativePool) {
                  stakeStatus = await onStake(
                    tokenAmountInBigNum.toString(10),
                    tokenAmountInBigNum.toString(10)
                  );
                } else {
                  stakeStatus = await onStake(tokenAmountInBigNum.toString(10));
                }
                if (stakeStatus === 1) {
                  toast.success("Deposited successfully!");
                  setTokenAmount(0);
                  closeModal();
                  dispatch(fetchPoolsUserDataAsync(account));
                } else {
                  toast.error("Deposit failed!");
                }
              } catch (e) {
                console.error(e);
                toast.error("Deposit failed!");
              }

              setPendingTx(false);
            } else {
              setTokenAmount(0);
            }
          }}
        >
          {" "}
          Deposit
        </button>
      </div>
    </Modal>
  );
});

export default DepositDao;
