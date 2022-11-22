import React from "react";
import { useWeb3React } from "@web3-react/core";
import {
  DEFAULT_CHAIN_ID,
  FIBO_LOGO_URL,
  FIBO_TOKEN_ADDRESS,
  FIBO_TOKEN_SYMBOL,
  NATIVE_TOKEN_SYMBOL,
} from "config";
import {
  useFIBOTotalValue,
  useTokenMarketInfo,
  useTokenPrice,
} from "state/hooks";
import styled from "styled-components";
import { getBalanceNumber } from "utils/formatBalance";
import { registerToken } from "utils/wallet";

const Header: React.FC = () => {
  const { account } = useWeb3React();
  const nativePrice = useTokenPrice(FIBO_TOKEN_SYMBOL, false, DEFAULT_CHAIN_ID);
  const marketInfo = useTokenMarketInfo(FIBO_TOKEN_ADDRESS);
  const totalLocked = useFIBOTotalValue();
  const totalLockedInUsdFormatted = totalLocked
    ? `$${getBalanceNumber(totalLocked, 18).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`
    : `-`;

  const totalSupplyInNum = getBalanceNumber(marketInfo.totalSupply, 18);
  const totalSupplyInUsdFormatted = totalSupplyInNum
    ? `$${(totalSupplyInNum * nativePrice).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`
    : `-`;

  const addTokenToMetamask = async () => {
    await registerToken(
      FIBO_TOKEN_ADDRESS,
      FIBO_TOKEN_SYMBOL,
      18,
      FIBO_LOGO_URL
    );
  };

  return (
    <Div
      className="wow fadeInDown"
      data-wow-duration="0.9s"
      data-wow-delay="0.4s"
    >
      <div className="headercontainer">
        <div className="current_price">
          {/* <h3>36,641.20 <span>+10.25%</span></h3> */}
          <div>
            <h3>
              {nativePrice.toLocaleString(undefined, {
                maximumFractionDigits: 7,
              })}{" "}
              USD{" "}
              <a
                className="chicon"
                href="https://polygon.poocoin.app/tokens/0x2b3b16826719bf0b494c8ddebaa5e882093ee37e"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-chart-line"></i>
              </a>
            </h3>
            <h6>
              <img src="images/fibo.png" alt="" className="borioicon" /> FIBO
              Price (FIBO)
            </h6>
          </div>
          <div className="btnOuter">
            <a
              href="https://quickswap.exchange/#/swap?exactField=input=0x0000000000000000000000000000000000001010&outputCurrency=0x2b3B16826719bF0B494c8ddebaA5E882093eE37e"
              className="border"
              target="_blank"
              rel="noreferrer"
            >
              <img src="images/fibo.png" className="borioicon" alt="" />
              Buy FIBO
            </a>
            <a
              href="https://polygonscan.com/address/0x2b3B16826719bF0B494c8ddebaA5E882093eE37e"
              target="_blank"
              rel="noreferrer"
            >
              FIBO Smart Contract
            </a>
            <a href="#" className="border">
              <img src="images/MetaMask_Fox.svg" alt="" />
              <span
                onClick={() => {
                  if (account) {
                    addTokenToMetamask();
                  }
                }}
              >
                Add FIBO to Metamask
              </span>
            </a>
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
        </div>
      </div>

      {/* <div className={bannertoggle== true ?"bannercontainer":"bannercontainer bannerhide"} style={bannerbg[myrandomval]}>
            <i className="fas fa-times" onClick={() => setBannertoggle(false)}></i>
          <img src="images/banner2.png" alt="" className="bannerimg" />
          <div className="text">
            ${tvlformattedwithzero()}  TVL has been cracked.
          </div>
      </div> */}
    </Div>
  );
};
const Div = styled.div`
  margin-bottom: 30px;
  .borioicon {
    border: 2px solid #d2d2d2;
  }
  .bannercontainer {
    background: #fff;
    height: 120px;
    border-radius: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    overflow: hidden;
    margin-top: 10px;
    position: relative;
    transition: all 0.3s ease;
    &.bannerhide {
      height: 0 !important;
    }
    .fa-times {
      position: absolute;
      right: 14px;
      top: 14px;
      color: rgba(255, 255, 255, 0.4);
      z-index: 10;
      cursor: pointer;
    }
    .bannerimg {
      height: 300%;
      position: absolute;
      left: 0;
      top: 50%;
      max-width: 40%;
      transform: translateY(-55%);
      object-fit: contain;
    }
    .text {
      padding: 20px;
      margin-right: 3%;
      font-size: 36px;
      color: #000;
      font-family: "Minako", sans-serif;
      position: Relative;
      z-index: 10;
      width: 100%;
      text-align: right;
    }
    @media screen and (max-width: 991px) {
      .bannerimg {
        z-index: 0;
        max-width: 80%;
        opacity: 0.2;
      }
      .text {
        text-align: center !important;
      }
    }
    @media screen and (max-width: 500px) {
      .text {
        font-size: 26px;
      }
    }
  }
  .headercontainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    color: #0e0e0e;
    padding: 20px;
    border-radius: 14px;
  }
  .current_price {
    display: flex;
    align-items: center;
    .btnOuter {
      display: flex;
      margin-right: 14px;
    }
    a {
      padding: 8px 16px;
      border-radius: 8px;
      background-color: #e00e8b;
      font-size: 14px;
      color: #23262f;
      color: #fff;
      margin-left: 20px;
      min-width: 150px;
      display: flex;
      font-weight: 400 !important;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      text-align: center;
      font-weight: 500;
      img {
        height: 24px;
        width: auto;
        margin-right: 8px;
        border-radius: 50%;
      }

      &.border {
        background-color: transparent;
        border: 2px solid #000 !important;
        color: #000;
        font-weight: 400;
      }
    }
    h3 {
      color: #000;
      font-weight: 600;
      display: flex;
      align-items: center;
      span {
        border-radius: 10px;
        padding: 8px 12px;
        background: #15c783;
        font-size: 12px;
        color: #000;
        margin-left: 12px;
      }

      .chicon {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgb(56, 50, 65);
        margin: 0 6px;
        min-width: unset;
        text-decoration: none;
        transiton: all 0.5s ease;
        background: transparent;
        cursor: pointer;
        &:hover {
          border: 2px solid #000;
          i {
            color: #000;
          }
        }
      }
      i {
        font-size: 14px;
        color: #000;
        cursor: pointer;
      }
    }
    h6 {
      color: #000;
      margin-bottom: 0;
      img {
        height: 28px;
        margin-right: 6px;
        border-radius: 50%;
      }
    }
  }

  .infos {
    display: flex;
    .info_single {
      padding-right: 20px;
      margin-right: 20px;
      border-right: 3px solid rgb(56, 50, 65);
      &:last-child {
        padding-right: 0px;
        margin-right: 0px;
        border-right: 0;
      }
      h6 {
        color: #000;
      }
    }
  }

  @media screen and (max-width: 1200px) {
    .headercontainer {
      flex-direction: column;
      align-items: flex-start;
      .current_price {
        margin-bottom: 14px;
        h3 {
          font-size: 24px;
        }
      }
      .infos {
        flex-flow: wrap;
        .info_single {
          margin-bottom: 12px;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .current_price {
      flex-direction: column;
      align-items: flex-start;
      .btnOuter {
        margin: 20px 0 10px;
        a {
          margin-left: 0;
          margin-right: 14px;
        }
      }
    }
  }

  @media screen and (max-width: 650px) {
    .info_single {
      border-right: 0 !important;
    }
    .current_price {
      .btnOuter {
        flex-direction: column;
        margin: 10px 0 10px;
        a {
          margin-left: 0;
          margin-right: 14px;
          margin-top: 10px;
        }
      }
    }
  }
`;

export default Header;
