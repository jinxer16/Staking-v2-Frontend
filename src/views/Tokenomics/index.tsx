import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Chart from "react-google-charts";

const Tokenomics: React.FC = () => {
  const pieOptions = {
    title: "",
    slices: [
      {
        color: "#ed7d31",
      },
      {
        color: "#ffc000",
      },
      {
        color: "#70ad47",
      },
      {
        color: "#9e480e",
      },
      {
        color: "#997300",
      },
      {
        color: "#43682b",
      },
      {
        color: "#f1975a",
      },
      {
        color: "#ffcd33",
      },
    ],
    legend: {
      position: "left",
      alignment: "top",
      textStyle: {
        color: "444444",
        fontSize: 14,
        fontWeight: 600,
      },
    },
    tooltip: {
      showColorCode: true,
      show: false,
    },
    chartArea: {
      right: "0",
      top: "10px",
      width: "100%",
      height: "80%",
    },
    fontName: "Gilroy",
  };
  return (
    <Div
      className="wow fadeInDown"
      data-wow-duration="0.9s"
      data-wow-delay="0.4s"
    >
      <Header />
      <h5 className="maincardheading">Tokenomics</h5>
      <div className="row">
        <div className="col-xl-8 col-lg-8">
          <div className="mycard">
            <div className="farmfees">
              <h5 className="myheading">Farm Fees</h5>
              Before staking tokens like eth in the farm, make sure to be aware
              of any deposit fees involved. The fees collected play an important
              role in building a complete ecosystem.
              <br /> <br />
              Fees from farms are disributed below: <br />
              - 50% is compounded through our vaults, these fees are then used
              to gradually buy and burn tokens. <br />
              - 25% is used for direct market buying and burning tokens
              periodically. <br />- 25% is allocated for project development and
              marketing.
            </div>
            <div className="toke">
              <h5 className="myheading">Tokenomics</h5>
              <div className="mrow">
                <b>Total Supply:</b>
                10M TIF
              </div>
              <div className="mrow">
                <b>TIF staking pool: </b>
                1M TIF distributed over three months
              </div>
              <div className="mrow">
                <b>TIF-ETH staking pool rewards: </b>
                3.5M TIF distributed over three months
              </div>
              <div className="mrow">
                <b>TIF-USDC staking pool rewards: </b>
                3.5M TIF distributed over three months
              </div>
              <div className="mrow">
                <b>ETH staking pool: </b>
                0.5M TIF over three months
              </div>
              <div className="mrow">
                <b>USDC staking pool: </b>
                0.5M TIF over three months
              </div>
              <div className="mrow">
                <b>TIF staking pool: </b>
                0.498M TIF over three months
              </div>
              <div className="mrow">
                <b>Dev share:</b>
                0.5M linearly vested until all pools end (3 months)
              </div>
              <div className="mrow">
                <b>Initial Liquidity:</b>
                2000 TIF
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4">
          <div className="mycard community">
            <h5 className="myheading">Chart</h5>
            <Chart
              chartType="PieChart"
              data={[
                ["Age", "Weight"],
                ["TIF", 12],
                ["TIF-ETH", 12],
                ["TIF-USDC", 22],
                ["ETH", 5],
                ["USDC", 1],
                ["NYAN", 23],
                ["DevWallet", 8],
                ["Liquidity", 9],
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        </div>
      </div>
    </Div>
  );
};
const Div = styled.div`
  .col-xl-4,
  .col-xl-8 {
    padding: 0 4px;
  }
  .maincardheading {
    width: 100%;
    margin: 0 10px 14px;
    color: #777e90;
    font-weight: bold;
    font-size: 15px;
  }
  padding-left: 40px;
  padding-right: 40px;
  .mycard {
    background: #fff;
    border-radius: 14px;
    color: #000;
    overflow: hidden;
    padding: 20px;
    width: 100%;
    max-width: unset;
    .toke {
      margin-top: 30px;
    }
    .farmfees {
    }
    .myheading {
      font-weight: 700;
      margin-bottom: 20px;
    }
    .mrow {
      display: flex;
      margin: 5px 0;
      font-size: 14px;
      b {
        margin-right: 10px;
        min-width: 180px;
        max-width: 180px;
      }
    }
  }
`;

export default Tokenomics;
