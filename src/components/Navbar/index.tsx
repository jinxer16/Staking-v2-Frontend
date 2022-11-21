// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { shorter } from "utils/formatBalance";
import { LogDescription } from "@ethersproject/abi";
import { ConnectorNames } from "config/types";
import { DEFAULT_CHAIN_ID, localStorageKey } from "config";
import useAuth from "hooks/useAuth";
import Security from "../Modals/Security";
import fibLogo from "../../assets/fibswap.svg";

const Navbar: React.FC = () => {
  const [click, setClick] = useState(false);
  const [isconnected, setIsconnected] = useState(true);
  const securitypanel = useRef(null);
  const { account } = useWeb3React();
  const { login, logout } = useAuth();

  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);
  const [activenm, setActivenm] = useState("home");
  function isActive(name: String) {
    return activenm == name;
  }
  function onlinkclick(name: String) {
    setActivenm(name);
    if (click) {
      handleClick();
    }
  }
  const body = document.querySelector("body");
  if (click) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "scroll";
  }

  return (
    <Nav
      className="wow fadeInDown"
      data-wow-duration="0.6s"
      data-wow-delay="0.5s"
    >
      <Security ref={securitypanel} />
      <div className={click ? "main-container" : ""} onClick={() => Close()} />
      <nav className="navbar " onClick={(e) => e.stopPropagation()}>
        <div className="nav-container">
          <div className="left">
            <Link exact to="/" className="nav-logo">
              <img src="images/fibswap.svg" alt="" />
              {/* <img src="images/logo-m.png" alt=""  className="logotwo"/> */}
            </Link>
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <ul className="nav-menu-inner">
            <li className="nav-item">
                <Link
                  exact
                  to={{ pathname: "https://staking.fibswap.io"}} target="_blank"
                >
                  <img src="images/stakinglogo.svg" alt=""/>
                </Link>
                <div>
            </div>                
              </li>
              <li className="nav-item">
                <Link
                  to={{ pathname: "https://dex.fibswap.io/" }} target="_blank"
                >
                  <img src="images/dexlogo.svg" alt=""/>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={{ pathname: "https://fibpal.fibswap.io/explore" }} target="_blank"
                >
                  <img src="images/fibpal.svg" alt=""/>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={{ pathname: "https://fibswap.tech" }} target="_blank"
                >
                  <img src="images/fibswaptech.svg" alt=""/>
                </Link>
              </li>   
              <li className="nav-item">
                <Link
                  to={{ pathname: "https://chart.fibswap.tech" }} target="_blank"
                >
                  <img src="images/chart.svg" alt=""/>
                </Link>
              </li>      
              <li className="nav-item">
                <Link
                  to={{ pathname: "/" }} target="_blank"
                >
                  <img src="images/tech2.svg" alt=""/>
                </Link>
              </li> 
              <li className="nav-item">
                <Link
                  to={{ pathname: "/" }} target="_blank"
                >
                  <img src="images/setting.svg" alt=""/>
                </Link>
              </li>                      
            </ul>
            <li className="nav-item connectbtn">
              {!account ? (
                <button
                  onClick={() => {
                    login(ConnectorNames.Injected, DEFAULT_CHAIN_ID);
                    window.localStorage.setItem(localStorageKey, "1");
                  }}
                >
                  {" "}
                  Connect wallet
                </button>
              ) : (
                <div className="isconnected">
                  <div>
                    <img src="images/metauser.png" alt="" /> {shorter(account)}
                  </div>
                </div>
              )}
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
          </div>
        </div>
      </nav>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #030823;
  color: #fff;
  .navbar {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
    padding: 0;
  }

  .nav-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-left: 30px;
    padding-right: 30px;
    .left {
      display: flex;
      align-items: center;
      img {
        margin-right: 18px;
      }
      h4 {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }
      h5 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }
      i {
        margin-left: 8px;
        cursor: pointer;
        color: #fff;
      }
      @media screen and (max-width: 576px) {
        h4 {
          font-size: 16px;
        }
        h5 {
          font-size: 14px;
        }
      }

      @media screen and (max-width: 450px) {
        margin-right: 20px;
      }
    }
  }

  .main-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    height: 100%;
    // transition:all 1s ease
  }

  .nav-logo {
    color: #fff;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    font-size: 2rem;
    max-width: 300px;
    margin-right: 24px;
    img {
      width: 100%;
      height: auto;
    }
    .logotwo {
      display: none;
      min-width: 50px;
      width: 50px;
    }
    @media screen and (max-width: 1450px) {
      .logoone {
        display: none;
      }
      .logotwo {
        display: block;
        margin-right: -80px;
      }
    }
    @media screen and (max-width: 1200px) {
      .logotwo {
        display: none;
      }
      .logoone {
        display: block;
      }
    }

    @media screen and (max-width: 576px) {
      .left {
      }
    }
  }

  .nav-menu {
    display: flex;
    list-style: none;
    text-align: center;
    margin-bottom: 0;
    height: 100%;
    transition: all 0.5s ease;
    flex-grow: 1;
    justify-content: flex-end;
  }
  .nav-menu-inner {
    display: flex;
    list-style: none;
    text-align: center;
    margin-bottom: 0;
    height: 100%;
    transition: all 0.5s ease;
    flex-grow: 1;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
  }

  .nav-links {
    color: #fff;
    text-decoration: none;
    padding: 0 10px;
    border-bottom: 3px solid transparent;
    font-size: 18px;
    line-height: 22px;
    &.active {
      color: rgb(56, 50, 65);
    }
  }
  .fa-code {
    margin-left: 1rem;
  }

  .nav-item {
    line-height: 40px;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    position: relative;
    &:hover:after {
      width: 100%;
      background: rgb(56, 50, 65);
    }
    &.socialIcons {
      a {
        border-radius: 50%;
        width: 40px;
        min-width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #e6e8ec;
        margin: 0 6px;
        text-decoration: none;
        transiton: all 0.5s ease;
        &:hover {
          border: 2px solid rgba(241, 173, 43, 0.3);
          i {
            color: rgba(241, 173, 43, 1);
          }
        }
      }
      .security {
        border-radius: 0;
        width: auto;
        height: auto;
        border: 0;
        font-size: 14px;
        color: #23262f;
        font-weight: bold;
        border-right: 2px solid #e5e7eb;
        padding-right: 10px;
        line-height: 22px;
        img {
          height: 30px;
          width: auto;
          position: Relative;
          left: -10px;
        }
        &:hover {
          border: 0;
          border-right: 2px solid #e5e7eb;
        }
      }
      i {
        font-size: 14px;
        color: #23262f;
        cursor: pointer;
      }
      &:hover:after {
        display: none;
      }
    }
    &.active {
      .nav-links {
        color: #000;
      }
      &:after {
        display: block !important;
        width: 100%;
        background: rgb(56, 50, 65);
      }
    }
  }

  .nav-item:after {
    content: "";
    position: absolute;
    height: 2px;
    width: 0;
    bottom: 0;
    background: rgb(56, 50, 65);
    transition: width 0.7s ease;
    transform: translateY(50%);
  }

  .nav-item .active {
    color: #ffdd40;
    border: 1px solid rgb(56, 50, 65);
  }

  .nav-icon {
    display: none;
  }

  .connectbtn {
    margin: 0;
    cursor: pointer;
    white-space: nowrap;
    img {
      margin-right: 6px;
      height: 20px;
    }
    button {
      color: #fff;
      max-height: 45x;
      padding: 0 20px;
    }
    &:after {
      display: none !important;
    }

    .isconnected {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      img {
        height: 40px;
        width: auto;
        border-radius: 50%;
      }
    }
  }
  @media screen and (max-width: 1100px) {
    .nav-menu-inner,
    .nav-menu {
      padding-left: 14px !important;
    }
  }
  @media screen and (max-width: 1200px) {
    .main-container {
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 10;
    }
    .connectbtn {
      justify-content: center;
      margin-top: 30px;
    }
    .socialIcons {
      justify-content: center;
      margin-top: 40px;
    }
    .nav-menu-inner {
      display: flex;
      flex-direction: column;
      height: 460px;
      position: static;
      transform: unset;
      width: 100%;
      padding: 0;
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      width: 100%;
      // border-top: 1px solid #fff;
      position: absolute;
      top: 300px;
      padding: 0;
      left: -110%;
      opacity: 1;
      transition: all 0.5s ease;
    }

    .nav-menu.active {
      // background: rgba(255,255,255,0.1);
      left: 0px;
      opacity: 1;
      transition: all 0.5s ease;
      z-index: 1;
      transition: all 0.5s ease;
    }
    .nav-item {
      color: #fff;
    }
    .nav-item .active {
      color: rgb(56, 50, 65);
      border: none;
    }
    .nav-links {
      padding: 1.5rem;
      width: 100%;
      display: table;
    }

    .nav-icon {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(-100%, 60%);
      font-size: 1.8rem;
      cursor: pointer;
      color: rgb(224, 14, 139);
    }
    .nav-logo {
      max-width: 250px !important;
    }
  }
  @media screen and (max-width: 576px) {
    .nav-logo {
      max-width: 160px !important;
      position: relative;
      left: -24%;
      top: 0px;
    }
  }
  @media screen and (max-width: 450px) {
    .nav-logo {
      max-width: 160px !important;
      position: relative;
      left: -30px;
      top: 0px;
    }
  }
`;

export default Navbar;
