import {
  DEFAULT_CHAIN_ID,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_SYMBOL,
} from "config";
import React from "react";
import {
  useORIOTotalValue,
  usePoolFromName,
  useTokenMarketInfo,
  useTokenPrice,
} from "state/hooks";
import { getBalanceNumber } from "utils/formatBalance";
// import { registerToken } from "utils/wallet";
import "./header.css";

const Header: React.FC = () => {
  const pool = usePoolFromName(NATIVE_TOKEN_SYMBOL);
  const nativePrice = useTokenPrice(
    NATIVE_TOKEN_SYMBOL,
    false,
    DEFAULT_CHAIN_ID
  );
  const marketInfo = useTokenMarketInfo(NATIVE_TOKEN_ADDRESS);
  const totalLocked = useORIOTotalValue();
  const totalLockedInUsdFormatted = totalLocked
    ? `$${getBalanceNumber(totalLocked, 18).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`
    : `-`;

  const totalSupplyInNum = getBalanceNumber(
    marketInfo.totalSupply,
    pool.stakeTokenDecimal
  );
  const totalSupplyInUsdFormatted = totalSupplyInNum
    ? `$${(totalSupplyInNum * nativePrice).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`
    : `-`;

  // const addTokenToMetamask = async () => {
  //   await registerToken(
  //     NATIVE_TOKEN_ADDRESS,
  //     NATIVE_TOKEN_SYMBOL,
  //     18,
  //     ORIO_LOGO_URL
  //   );
  // };
  return (
    <div
      className="wow fadeInDown"
      data-wow-duration="0.9s"
      data-wow-delay="0.4s"
    >
      <div className="headercontainer">
        <div className="current_price">
          {/* <h3>36,641.20 <span>+10.25%</span></h3> */}
          <div className="leftSection">
            <h6>
              <img src="images/tokenicon.png" alt="" className="borioicon" />
            </h6>
            <div className="btnOuter">
              <a
                href="https://bsc.fibswap.io/swap?outputCurrency=0xa30BAba694b8Fc3524C46edC5af295F55381dc60"
                target="_blank"
                rel="noreferrer"
              >
                <button>Buy ORIO</button>
              </a>
              <a
                href="https://bscscan.com/address/0xa30BAba694b8Fc3524C46edC5af295F55381dc60"
                target="_blank"
                rel="noreferrer"
              >
                <button className="orioSmartChain">Smart Contract</button>
              </a>
              {/* <a href="#" className="border">
                <span onClick={() => {
                      if (account) {
                          addTokenToMetamask()
                      }
                    }}>
                Add ORIO to Metamask
                </span>
              </a> */}
            </div>
          </div>
        </div>
        <div className="infos">
          <div className="info_single">
            <h6>Total Value</h6>
            <b>{totalLockedInUsdFormatted}</b>
          </div>
          <div className="info_single">
            <h6>Market Cap</h6>
            <b>{totalSupplyInUsdFormatted} </b>
          </div>
          <div>
            <h6>Boorio Price</h6>
            <b>
              $
              {nativePrice.toLocaleString(undefined, {
                maximumFractionDigits: 7,
              })}
            </b>
          </div>
        </div>
      </div>

      {/* <div className={bannertoggle== true ?"bannercontainer":"bannercontainer bannerhide"} style={bannerbg[myrandomval]}>
            <i className="fas fa-times" onClick={() => setBannertoggle(false)}></i>
          <img src="images/banner2.png" alt="" className="bannerimg" />
          <div className="text">
            ${tvlformattedwithzero()}  TVL has been cracked.
          </div>
      </div> */}
    </div>
  );
};

export default Header;
