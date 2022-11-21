import React from 'react'
import styled from 'styled-components'
import FibHeader from '../../components/FibHeader'
import FarmCard from '../../components/Cards/Farm'
import { usePools } from 'state/hooks'
const HomeDiv = styled.div`
.col-lg-4{
  padding:0 4px;
}
.row{
  margin:0 ;
}
    padding-left:40px;
    padding-right:40px;
  // .container{
  //   margin:60px 0;
  //   .heading{
  //     text-align:center;
  //     margin-bottom:30px;
  //   }
  // }
  .cardsouter{
    display:flex;
    margin: 0 -8px;
    justify-conten:space-between;
    align-items: flex-start;
    flex-flow: wrap;
    .maincardheading{
      width:100%;
      margin:0 10px 14px;
      color: #fff;
      font-weight: bold;
      font-size:18px;
    }
    .row{
      justify-content: center;
    }
    .col-lg-4{
      margin-bottom:10px;
    }
  }
`
const Landing: React.FC = () => {

  const pools = usePools()
  return (
    <HomeDiv >
      {/* <Header/> */}
      <FibHeader/>
      <div className="cardsouter">
          <div className="row w-100">
            {
              pools.map(pool => {
                return <div className="col-lg-4 col-md-6 col-sm-6">
                  <FarmCard poolName={pool.name} isLpPool={pool.isLpPool} />
                </div>
              })
            }
          </div>
      </div>
    </HomeDiv>
    
  )
}

export default Landing
