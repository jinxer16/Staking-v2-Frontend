import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { DEFAULT_CHAIN_ID } from 'config';
import { useUnStake } from 'hooks/useUnStake';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { usePoolFromName, usePoolUser } from 'state/hooks';
import { fetchPoolsUserDataAsync } from 'state/pools';
import { getBalanceNumber, getDecimalAmount } from 'utils/formatBalance';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '600px',
    border: 0,
    borderRadius: '20px',
  },
};

const { forwardRef, useRef, useImperativeHandle } = React

interface WithdrawModalProps {
  name: string
}

const Withdraw:React.FC<WithdrawModalProps> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(false)

  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const poolName = props.name
  const pool = usePoolFromName(poolName)
  const { onUnStake } = useUnStake(pool.address[DEFAULT_CHAIN_ID])
  const [tokenAmount, setTokenAmount] = useState(0)
  const [pendingTx, setPendingTx] = useState(false)  

  const { stakedBalance} = usePoolUser(poolName)
  const userStaked = getBalanceNumber(stakedBalance, pool.stakeTokenDecimal)
  const userStakedBalanceFormatted = userStaked
  ? `${userStaked.toLocaleString(undefined,{maximumFractionDigits: 9})} ${pool.stakeTokenSymbol}`
  : `0.000000000 ${pool.stakeTokenSymbol}`  

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setIsOpen(true)
    },
  }))

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false)
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
        <h5>{userStakedBalanceFormatted}</h5>
        {/* <i className="fas fa-times" onClick={() => closeModal()}></i> */}
        <div className="buttonOuter">
        <input type="number" placeholder="0.00" value={tokenAmount} onChange={e => {
          setTokenAmount(parseFloat(e.target.value))
        }} />
          <button onClick={() => setTokenAmount(userStaked)}>MAX</button>
        </div>
        
        <button disabled={pendingTx} onClick={async () => {
            if (tokenAmount <= userStaked) {
              const tokenAmountInBigNum = getDecimalAmount(new BigNumber(tokenAmount), pool.stakeTokenDecimal)
              try {
                setPendingTx(true)
                const stakeStatus = await onUnStake(tokenAmountInBigNum.toString(10))
                if (stakeStatus == 1) {
                  toast.success('Withdraw successfully!')
                  setTokenAmount(0)
                  closeModal()
                  dispatch(fetchPoolsUserDataAsync(account))
                } else {
                  toast.error('Withdraw failed!')
                }
              } catch (e) {
                console.error(e)
                toast.error('Withdraw failed!')
              }

              setPendingTx(false)
              
            } else {
              setTokenAmount(0)
            }          
        }}> Withdraw</button>
      </div>
    </Modal>
  )
})

export default Withdraw
