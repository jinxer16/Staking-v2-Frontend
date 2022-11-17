import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";

const Roadmap: React.FC = () => {
  return (
    <Div
      className="wow fadeInDown"
      data-wow-duration="0.9s"
      data-wow-delay="0.4s"
    >
      <Header />
      <h5 className="maincardheading">Roadmap</h5>
      <div className="row roadmapsec">
        <div className="col-xl-6 col-lg-6">
          <div className="roadmapheading">
            <h5>Q3</h5>
            <div className="row">
              <div className="col-sm-4">
                <h6>JUL</h6>
              </div>
              <div className="col-sm-4">
                <h6>AUG</h6>
              </div>
              <div className="col-sm-4">
                <h6>SEP</h6>

                <div className="info lvl1 sep">
                  <div className="infocontent">
                    <b>13th September, 2021</b>
                    <div>tif.finance website live</div>
                  </div>
                  <div className="infocontent">
                    <b>15th September, 2021 </b>
                    <div>Farming launch.</div>
                  </div>
                  <div className="infocontent">
                    <b>Late Q3</b>
                    <div>
                      Complete new yield aggregator launch, first true solution
                      on arbitrum.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-lg-6">
          <div className="roadmapheading">
            <h5>Q4</h5>
            <div className="row">
              <div className="col-sm-4">
                <h6>OCT</h6>
                <div className="info lvl1 oct">
                  <div className="infocontent">
                    <b>Early Q4</b>
                    <div>
                      Complete new yield aggregator launch, first true solution
                      on arbitrum.
                    </div>
                  </div>
                  <div className="infocontent">
                    <b>Early Q4</b>
                    <div>
                      Lottery implementation, burns $TIF and will be the first
                      provably fair, yield farming based lottery on arbitrum.{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <h6>NOV</h6>
                <div className="info lvl2 nov">
                  <div className="infocontent">
                    <b>Mid Q4</b>
                    <div>
                      TifDEX - Arbitrum dex with focus on liquidity incentive
                      and trading fee tiers. Will introduce the $TIB (This Is
                      Better) token to join our ecosystem at this point, which
                      will be percentage airdropped to long term stakers and
                      holders of $TIF weighted according to time.
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <h6>DEC</h6>
                <div className="info lvl3 dec">
                  <div className="infocontent">
                    <b>Mid-Late Q4</b>
                    <div>
                      NFT's implementation, rewards distributed based on farming
                      participation, includes burns, bonus multiplier farming
                      and more, weighted based on time.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="roadmapyear">
        <div className="roadmapheading">
          <h5>2021</h5>
        </div>
      </div>
    </Div>
  );
};
const Div = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  .maincardheading {
    width: 100%;
    margin: 0 10px 14px;
    color: #777e90;
    font-weight: bold;
    font-size: 15px;
  }
  .roadmapsec {
    padding-bottom: 30px;
  }
  .roadmapyear {
    .roadmapheading {
      h5 {
        padding: 16px;
        border-radius: 10px;
      }
    }
  }
  .col-xl-4 {
    padding: 0 4px;
  }
  .row {
    margin: 0;
    .col-xl-6 {
      padding: 0;
      &:first-child {
        padding-right: 6px;
      }
    }
  }
  .roadmapheading {
    height: 100%;
    h5 {
      text-align: center;
      font-size: 18px;
      background: #fff;
      padding: 20px 14px 10px;
      margin: 0;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
    }
    .row {
      height: 100%;
      h6 {
        color: #777e90;
        font-weight: bold;
        background: #fff;
        padding: 10px 14px 20px;
        margin-bottom: 0;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      .col-sm-4 {
        padding: 0;
        position: relative;
        height: 100%;
        &::before {
          position: absolute;
          content: "";
          left: 10px;
          top: 0;
          background: #d9dcdf;
          width: 2px;
          height: 100%;
          z-index: -1;
          opacity: 0.9;
        }
        &:nth-child(1) {
          h6 {
            border-bottom-right-radius: 0px;
            border-bottom-left-radius: 8px;
          }
        }
        &:nth-child(2) {
          h6 {
            border-bottom-right-radius: 0px;
            border-bottom-left-radius: 0px;
          }
        }
        &:nth-child(3) {
          h6 {
            border-bottom-right-radius: 8px;
            border-bottom-left-radius: 0px;
          }
        }
      }

      .info {
        font-size: 13px;
        border-left: 2px solid #d9dcdf;
        padding-left: 20px;
        margin-left: 40px;
        &.lvl1 {
          padding-top: 40px;
        }
        &.lvl2 {
          padding-top: 300px;
        }
        &.lvl3 {
          padding-top: 480px;
        }

        .infocontent {
          position: relative;
          margin-top: 20px;
          z-index: 99;
          div {
            // white-space: nowrap;
            min-width: 40vw;
          }
          &::before {
            position: absolute;
            content: "";
            left: -21px;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            background: #f1ad2b;
            width: 10px;
            height: 10px;
            border-radius: 3px;
            z-index: 10;
          }
        }
        &.sep {
          margin-left: 80px !important;
        }
        &.nov {
          .infocontent {
            div {
              white-space: unset;
              min-width: 26vw;
            }
          }
        }

        &.dec {
          .infocontent {
            div {
              white-space: unset;
              min-width: unset;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 991px) {
    .row {
      .col-xl-6 {
        margin-bottom: 50px;
        &:first-child {
          padding-right: 0px;
        }
      }
    }

    .row {
      h6 {
        padding: 14px !important;
        border-radius: 10px;
      }
      .roadmapheading {
        h5 {
          padding: 14px;
          border-radius: 10px;
        }
      }
      .info {
        font-size: 13px;
        &.lvl1 {
          padding-top: 40px;
        }
        &.lvl2 {
          padding-top: 250px !important;
        }
        &.lvl3 {
          padding-top: 440px !important;
        }

        .infocontent {
          margin-top: 20px;
          div {
            // white-space: nowrap;
            min-width: 40vw;
          }
        }

        &.nov {
          .infocontent {
            div {
              white-space: unset;
              min-width: 45vw !important;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 576px) {
    .row {
      .col-xl-6 {
        margin-bottom: 0px;
      }
      .col-sm-4 {
        margin-top: 10px;
        height: auto !important;
      }
    }

    .row {
      .info {
        font-size: 13px;
        margin-bottom: 50px;
        margin-left: 30px !important;
        &.lvl1 {
          padding-top: 20px !important;
        }
        &.lvl2 {
          padding-top: 20px !important;
        }
        &.lvl3 {
          padding-top: 20px !important;
        }

        .infocontent {
          margin-top: 20px;
          div {
            // white-space: nowrap;
            min-width: 40vw;
          }
        }

        &.nov {
          .infocontent {
            div {
              white-space: unset;
              min-width: 45vw !important;
            }
          }
        }
      }
    }
  }
`;

export default Roadmap;
