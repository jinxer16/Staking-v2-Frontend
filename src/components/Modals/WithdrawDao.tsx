import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { DEFAULT_CHAIN_ID } from "config";
import contracts from "config/contracts";
import { useApprove } from "hooks/useApprove";
import { useERC20 } from "hooks/useContracts";
import useRefresh from "hooks/useRefresh";
import { useTokenBalance } from "hooks/useTokenBalance";
import { useUnStake } from "hooks/useUnStake";
import { useWithdraw } from "hooks/useWithdraw";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { usePoolFromName, usePoolUser } from "state/hooks";
import { fetchPoolsUserDataAsync } from "state/pools";
import { getAllowance, getTokenBalance } from "utils/callHelpers";
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

interface WithdrawModalProps {
  name: string;
}

const WithdrawDao: React.FC<WithdrawModalProps> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [approved, setApproved] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();

  const fiboDaoContract = useERC20(contracts.daoToken[DEFAULT_CHAIN_ID]);

  const { onApprove } = useApprove(
    fiboDaoContract,
    contracts.daoDistributor[DEFAULT_CHAIN_ID]
  );
  const handleApprove = useCallback(async () => {
    try {
      const approveStatus = await onApprove();
      if (approveStatus === 1) {
        toast.success("Approved successfully!");
      }
      setApproved(true);
    } catch (e) {
      console.error(e);
      toast.error("Approve failed!");
    }
  }, [onApprove]);

  useEffect(() => {
    const fetchAllowance = async () => {
      const _allowance = await getAllowance(
        contracts.daoToken[DEFAULT_CHAIN_ID],
        account,
        contracts.daoDistributor[DEFAULT_CHAIN_ID]
      );
      setAllowance(_allowance);
    };

    if (account) {
      fetchAllowance();
    }
  }, [account]);

  const poolName = props.name;
  const pool = usePoolFromName(poolName);
  const { onUnStake } = useUnStake(pool.address[DEFAULT_CHAIN_ID]);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [pendingTx, setPendingTx] = useState(false);

  let defaultTokenBalance =
    Math.floor(useTokenBalance(contracts.daoToken[DEFAULT_CHAIN_ID]) * 100000) /
    100000;
  const defaultTokenBalalnceFormatted = defaultTokenBalance
    ? `${defaultTokenBalance.toLocaleString(undefined, {
        maximumFractionDigits: 5,
      })} FIBODAO`
    : `0.000000000 FIBODAO`;

  const [tokenBalance, setTokenBalance] = useState(defaultTokenBalance);
  const [tokenBalanceFormatted, setTokenBalanceFormatted] = useState(
    defaultTokenBalalnceFormatted
  );

  useEffect(() => {
    const _tokenBalanceFormatted = tokenBalance
      ? `${tokenBalance.toLocaleString(undefined, {
          maximumFractionDigits: 5,
        })} FIBODAO`
      : `0.000000000 FIBODAO`;
    setTokenBalanceFormatted(_tokenBalanceFormatted);
  }, [tokenBalance]);

  useEffect(() => {
    if (account) {
      const fetchTokenBalance = async (_account, _tokenAddress) => {
        const res = await getTokenBalance(_account, _tokenAddress);
        setTokenBalance(Math.floor(res * 100000) / 100000);
      };

      fetchTokenBalance(account, contracts.daoToken[DEFAULT_CHAIN_ID]);
    }
  }, [fastRefresh, account]);

  const { onWithdraw } = useWithdraw(
    contracts.daoDistributor[DEFAULT_CHAIN_ID]
  );

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
        <h5>{`${tokenAmount * 50000} FIBO`}</h5>
        {approved || allowance > 0 ? (
          <button
            disabled={pendingTx}
            onClick={async () => {
              if (tokenAmount <= tokenBalance) {
                const tokenAmountInBigNum = getDecimalAmount(
                  new BigNumber(tokenAmount),
                  18
                );
                try {
                  setPendingTx(true);
                  const withdrawStatus = await onWithdraw(
                    tokenAmountInBigNum.toString(10)
                  );
                  if (withdrawStatus === 1) {
                    toast.success("Withdraw successfully!");
                    setTokenAmount(0);
                    closeModal();
                    dispatch(fetchPoolsUserDataAsync(account));
                  } else {
                    toast.error("Withdraw failed!");
                  }
                } catch (e) {
                  console.error(e);
                  toast.error("Withdraw failed!");
                }

                setPendingTx(false);
              } else {
                setTokenAmount(0);
              }
            }}
          >
            {" "}
            Withdraw
          </button>
        ) : (
          <button onClick={handleApprove}> Approve</button>
        )}
      </div>
    </Modal>
  );
});

export default WithdrawDao;
