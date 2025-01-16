import React, { useEffect, useState } from 'react'
import CardRegular from '../cards/Cards'
import circleChart from "../../../../../../../assets/portfolio/circle-graph.png"
import IndicatorBox from '../indicator/IndicatorBox'
import { DownArrowIcon, UpArrowIcon } from 'assets/icons'
import downloadIcon from  "../../../../../../../assets/portfolio/download.png"
import FormSelect from '../FormSelect'
import './headerComp.scss'
import { useAppSelector } from '@store/hooks'
import useWallet from 'api/wallet/useWallet'
import { useCookies } from 'react-cookie'
import { IWallet } from '@interfaces'
// import FormSelect from 'pages/private/platform/kyc/components/FormSelect'

const HeaderComponents = () => {
    const [currencies, setCurrencies] = useState<IWallet[]>([])
    const [selectedCurrency, setSelectedCurrency] = useState("Demo")
    const [cookies] = useCookies(["access_token"]);
    const {mutate, data} = useWallet({
        onSuccess: (data) => {
        //    console.log(data.map(item => (
        //     {value: item.}
        //    )))

            // setCurrencies
            setCurrencies(data.results)

            console.log("sdfdsdfgfgfkjkjkdkgkkslljk",data)
        },
        onError: () => {}
    })

    useEffect(()=>{
        mutate(cookies.access_token)

    },[])

    console.log("selected cuuresncy", selectedCurrency)
    const selectedCurrencyItem = currencies.find(item => item.currency.longer_name === selectedCurrency);

  return (
    <div>
        <div className='flex flex-col md:flex-row gap-3 flex- justify-between'>
            <CardRegular
                desc="Total Portfolio Value"
                amount={4500}
                
                />
            <div className='flex items-center justify-between basis-[60%]  bg-gray-100/10 px-4 py-2 rounded-lg '>
                <div className='bg-red-'>
                    <p className='text-sm font-normal'>Distribuion of Assets</p>
                    <div>
                        {/* <d?iv> */}

                        <div className='flex gap-5'>
                            <IndicatorBox color='bg-green-600'/>
                            
                            <p className='text-xs fomt-normal'>89% Cryptocorrencies</p>
                        </div>
                        
                        <div className='flex mt-1 gap-5'>
                            <IndicatorBox/>

                            <p>11% Stocks</p>

                        </div>
                        {/* </di?v> */}

                    </div>

                </div>


                <div>
                    <img src={circleChart}  alt="" />

                </div>
            </div>
    </div>
    <div className='flex flex-col sm:flex-row md:gap-10'> 
        <div className='flex flex-1 flex-col md:flex-row items-center justify-between bg-gray-100/10 rounded-lg px-4 py-4 my-4'>
            <div className=''>
                <p className='text-sm'>Download PDF File</p>
                <div className='flex items-center gap-5'>
                <span>Portfolio</span><DownArrowIcon/>

                </div>

            </div>
            <img src={downloadIcon} alt="" className='bg-gray-100/10 p-1 rounded h-8' />


        </div>

        <div className=' flex-1 items-center justify-between bg-gray-100/10 rounded-lg px-4 py-4 my-4'>
            <div className=''>
                <p>Account Balance</p>
                <div className='flex items-center gap-5'>
                    <div className='flex item-center gap-10  w-full justify-between currency-select'>

                        <div className='basis-[60%] gap-[20%] flex items-center'><UpArrowIcon/> 
                            {selectedCurrencyItem ? (<><span className='flex flex-1'>{selectedCurrencyItem?.currency.symbol + " "+ selectedCurrencyItem?.balance}</span> </>) : "000"}
                         </div> 
                         <FormSelect
                         className='currencyDrop'
                         data={[{label: "USD", value: "USD"},
                            {label: "EUR", value: "eur"},
                            {label: "BTC", value: "btc"},
                            {label: "Demo", value: "Demo"}
                         ]}
                         id="currency"
                         selectedId='Demo'
                         onSelect={(value)=> setSelectedCurrency(value)}


                         /> 

                    </div>

                </div>

            </div>


        </div>

    </div>
   

    </div>
  )
}

export default HeaderComponents