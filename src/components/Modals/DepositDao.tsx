import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { DEFAULT_CHAIN_ID, FIBO_TOKEN_ADDRESS } from "config";
import contracts from "config/contracts";
import { useApprove } from "hooks/useApprove";
import { useERC20 } from "hooks/useContracts";
import { useDeposit } from "hooks/useDeposit";
import useRefresh from "hooks/useRefresh";
import { useTokenBalance } from "hooks/useTokenBalance";
import useWeb3Provider from "hooks/useWeb3Provider";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { usePoolFromName } from "state/hooks";
import { fetchPoolsUserDataAsync } from "state/pools";
import { getAllowance, getTokenBalance } from "utils/callHelpers";
import { getDecimalAmount } from "utils/formatBalance";

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

const { forwardRef, useImperativeHandle } = React;

interface DepositModalProps {
  name: string;
}

const DepositDao: React.FC<DepositModalProps> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const { fastRefresh } = useRefresh();

  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const provider = useWeb3Provider();
  const poolName = props.name;
  const pool = usePoolFromName(poolName);

  const { onDeposit } = useDeposit(contracts.daoDistributor[DEFAULT_CHAIN_ID]);
  const fiboContract = useERC20(FIBO_TOKEN_ADDRESS);

  const { onApprove } = useApprove(
    fiboContract,
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
        FIBO_TOKEN_ADDRESS,
        account,
        contracts.daoDistributor[DEFAULT_CHAIN_ID]
      );
      setAllowance(_allowance);
    };

    if (account) {
      fetchAllowance();
    }
  }, [account]);

  let defaultTokenBalance =
    Math.floor(useTokenBalance(FIBO_TOKEN_ADDRESS) * 100000) / 100000;
  const defaultTokenBalalnceFormatted = defaultTokenBalance
    ? `${defaultTokenBalance.toLocaleString(undefined, {
        maximumFractionDigits: 5,
      })} FIBO`
    : `0.000000000 FIBO`;

  const [tokenBalance, setTokenBalance] = useState(defaultTokenBalance);
  const [tokenBalanceFormatted, setTokenBalanceFormatted] = useState(
    defaultTokenBalalnceFormatted
  );

  useEffect(() => {
    if (account) {
      const fetchTokenBalance = async (_account, _tokenAddress) => {
        const res = await getTokenBalance(_account, _tokenAddress);
        setTokenBalance(Math.floor(res * 100000) / 100000);
      };

      fetchTokenBalance(account, FIBO_TOKEN_ADDRESS);
    }
  }, [fastRefresh, provider, account, pool]);

  useEffect(() => {
    const _tokenBalanceFormatted = tokenBalance
      ? `${tokenBalance.toLocaleString(undefined, {
          maximumFractionDigits: 5,
        })} FIBO`
      : `0.000000000 FIBO`;
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
        <h5>{`~${tokenAmount / 50000} FIBODAO`}</h5>
        {approved || allowance > 0 ? (
          <button
            disabled={pendingTx}
            onClick={async () => {
              if (tokenAmount <= tokenBalance) {
                const tokenAmountInBigNum = getDecimalAmount(
                  new BigNumber(tokenAmount),
                  18
                );
                console.info(tokenAmountInBigNum.toString());
                try {
                  setPendingTx(true);
                  let depositStatus = 0;
                  depositStatus = await onDeposit(
                    tokenAmountInBigNum.toString(10)
                  );
                  if (depositStatus === 1) {
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
        ) : (
          <button onClick={handleApprove}>Approve</button>
        )}
      </div>
    </Modal>
  );
});

export default DepositDao;
