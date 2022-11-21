import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import { getTokenBalance } from "utils/callHelpers"
import { getBalanceNumber } from "utils/formatBalance"
import useWeb3Provider from "./useWeb3Provider"

export const useTokenBalance = (tokenAddress: string) => {
    const {account} = useWeb3React()
    const [tokenBalance, setTokenBalance] = useState(0)
    useEffect(() => {
        if (account) {
            const fetchTokenBalance = async (_account, _tokenAddress) => {
                const res = await getTokenBalance(_account, _tokenAddress)
                setTokenBalance(res)
            }
    
            fetchTokenBalance(account, tokenAddress)
        }
    },[account, tokenAddress])

    return tokenBalance
}

export const useETHBalance = () => {
    const { account } = useWeb3React()
    const provider = useWeb3Provider()
    const [tokenBalance, setTokenBalance] = useState(0)
    useEffect(() => {
        if (account) {
            const fetchETHBalance = async (_account, _provider) => {
                const res = await _provider.getBalance(_account)
                setTokenBalance(getBalanceNumber(new BigNumber(res.toString()), 18))
            }
            fetchETHBalance(account, provider)
        }
    },[account, provider])

    return tokenBalance
}
