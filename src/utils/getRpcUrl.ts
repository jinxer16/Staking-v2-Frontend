import { CHAIN_CONFIG, DEFAULT_CHAIN_ID } from "config"

const getRpcUrl = () => {

    const providers = CHAIN_CONFIG[DEFAULT_CHAIN_ID].provider
    const randomIndex = Math.floor(Math.random() * (providers.length - 1))
    return providers[randomIndex];
}

export default getRpcUrl