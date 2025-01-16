
  import React, { forwardRef, useEffect, useRef, useState } from "react";
  import { useCookies } from "react-cookie";
  import useMarketData from "api/marketData/useMarketData";
  import useMarketAssets from "api/marketData/useMarketAssets";
  import { useAppDispatch, useAppSelector } from "@store/hooks";
  import {
    setAssets,
    setCrypto,
    setInitialCrypto,
    setCurrentSymbol,
  } from "@store/slices/markets";
  import { MainChartProps, MarketData, TransformedMarket } from "./types";
  import { convertTimestampToDateString, dateFormter, getPreviousDayFromTimestamp } from "helpers/dateFormter";
  import useGetClock from "api/marketData/useGetClock";
  import CountDown from "components/countDown/CountDown";
  
  
  const BarChart: React.FunctionComponent<any>  = forwardRef(({ data: newData,colors, type, chartScale, refs }) => {
    // rename data being passed down to new data so it wont confilict real data thats coming from the socket 
    const {barChartContainerRef, barChartRef, barChartseriesRef } = refs;
    const [cookies] = useCookies(["access_token"]);
  
  
    const { mutate: marketDataMutation, data: market } = useMarketData({});
    const { mutate: assetsListMutate } = useMarketAssets({});
    const { mutate: getClockMutate, data: clockData } = useGetClock({});
    const markets = useAppSelector((state) => state.markets);
    const { wsTicket } = useAppSelector((state) => state.user);
    const { trade, finished, duration, amount } = useAppSelector((state) => state.trades);
    const userState = useAppSelector((state) => state);
  
    const {themeSelect} = useAppSelector(state => state.themeBg)
  
    const dispatch = useAppDispatch();
  
    const data: MarketData[] = markets.crypto[markets.currentSymbol];
  
  
    useEffect(() => {
      getClockMutate(cookies.access_token);
    }, []);
  
  
    useEffect(() => {
      if (clockData) {
        const startTimeFormatted = getPreviousDayFromTimestamp(clockData.timestamp)
        const endTimeFormatted = convertTimestampToDateString(clockData.timestamp)
        marketDataMutation({
          token: cookies.access_token,
          options: {
            symbols: markets.symbol,
            start: startTimeFormatted,
            end: endTimeFormatted,
          },
        });
      }
    }, [markets.symbol, clockData]);
  
    useEffect(() => {
      // Load the list of assets
      assetsListMutate(
        {
          token: cookies.access_token,
          data: {
            asset_class: "crypto",
          },
        },
        {
          onSuccess: (data) => {
            dispatch(setAssets(data));
          },
        }
      );
    }, [cookies.access_token]);
  
    useEffect(() => {
      if (market && typeof market === "object") {
        const transformedMarket: TransformedMarket = {};
        Object.keys(market).forEach((key) => {
          transformedMarket[key] = [];
  
          market[key].forEach((item: any) => {
            // Check if the timestamp exists in the initial data
            const initialDataTimestampExists = market[key].some(
              (initialItem: { time: any }) => initialItem.time === item.timestamp
            );
  
            const existingIndex = transformedMarket[key].findIndex(
              (existingItem) => existingItem?.time === item?.timestamp
            );
  
            if (existingIndex === -1 && !initialDataTimestampExists) {
              // Add new data point only if the timestamp doesn't exist
              transformedMarket[key].push({
                ...item,
                time: item.timestamp,
                value: item.open,
              });
            } else if (existingIndex !== -1) {
              // Update existing data point if the timestamp exists
              transformedMarket[key][existingIndex] = {
                ...item,
                time: item.timestamp,
                value: item.open,
              };
            }
          });
        });
  
        dispatch(setInitialCrypto(transformedMarket));
  
        dispatch(setCurrentSymbol(markets?.symbol));
  
        // socket?.send(
        //   JSON.stringify({
        //     type: "join_room",
        //     room_name: markets.wsRoom,
        //   })
        // );
      }
    }, [market]);
  
    // useEffect(() => {
    //   // if (markets?.crypto[markets?.symbol]?.length > 0) {
    //     // dispatch(setCrypto(socketData));
    //   // }
     
    // }, [socketData, crypto]);
   
  
    useEffect(()=>{
      console.log('object');
      console.log(trade);
      console.log(finished);
      if(finished){
  
        console.log(trade);
        console.log('here');
  
      
      }
      
    },[finished])
  


  
    // TODO - Lazy loading the charts
    return  <div style={{ position: 'relative', height: '100%' }}>

        <div ref={barChartContainerRef} style={{ height: '100%' }} />
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '49%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '14px',
          pointerEvents: 'none' // This ensures the text doesn't interfere with chart interaction
        }}>
        {
          trade !== null  && 
          <CountDown time={duration}/>
        }
        </div>
      </div>
    
    
      
      
  });
  
  export default BarChart;
  