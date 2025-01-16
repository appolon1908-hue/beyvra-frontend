import Navbar from '../commonComponents/navbar/Navbar'
import Footer from '../../../public/landing/footer'
import './regulation.scss'
import RegulationCard from './regulationCard/RegulationCard'
const Regulation = () => {

    const detailList = [
        {
            title:'Financial Service Authority (FSA) - St Vincent & The Grenadines',
            list:[
                'Licence Number: 27030 BC 2023',
                "FSA, created by the 2011 Act, regulates St. Vincent's non-bank sectors, merging regulatory bodies for efficient oversight."
            ]
        },
        {
            title:'Financial Sector Conduct Authority (FSCA)',
            list:[
                'Licence Number: 46860',
                "Licensed to operate as an Over The Counter Derivatives Provider (ODP).",
                "FSCA regulates market conduct to enhance market efficiency and integrity, ensuring fair treatment of financial consumers.",
            ]
        },
        {
            title:'Financial Conduct Authority (FCA), UK',
            list:[
                'Licence Number: 481853',
                "FCA regulates business conduct for honest, fair markets, ensuring a fair deal for traders and financial integrity.",
                "View markets.com/uk/",
            ]
        },
        {
            title:'Australian Securities and Investments Commission (ASIC)',
            list:[
                'License Number: 424008',
                "ASIC ensures market integrity, fairness, and effectiveness, fostering a transparent, responsible financial landscape.",
               
            ]
        },
        {
            title:'Cyprus Securities and Exchange Commission (CySEC)',
            list:[
                'Licence Number: 092/08',
                "CySEC ensures fairness and efficiency in Cyprus' financial markets, safeguarding investor interests.",
                
            ]
        },
        {
            title:'Financial Services Commission (FSC) - British Virgin Islands',
            list:[
                'Licence Number: SIBA/L/14/1067',
                "BVI FSC, set up by the 2001 Act, regulates, supervises, and inspects all financial services in and from the BVI.",
            ]
        },
    ]
  return (
    <div className='regulationPageContainer'>
        <Navbar/>

        <div className="regulationHeadingContainer">
            <h2>Regulations</h2>
            <p>Note: The English version of this Policy is the governing version and shall prevail whenever there is any discrepancy between the English version and the versions in any other language.</p>
        </div>

        <div className="regulationCardListContainer">
            {
                detailList.map((item)=>{
                    return (
                        <RegulationCard title={item.title} list={item.list} />
                    )
                })
            }
           
        </div>
        <Footer/>
    </div>
  )
}

export default Regulation