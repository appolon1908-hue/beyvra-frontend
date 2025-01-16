import { useState } from "react";
import LenderBankCard from "../../../components/lender/lenderBankCard/LenderBankCard";
import LenderHeader from "../../../components/lender/lenderHeader/LenderHeader";
import "./lender.scss";
import { Drawer } from "antd";
import { CloseIcon } from "../../../assets/icons";

import Ibercaja from '../../../assets/lender/ibercaja.png'

import Sabadell from '../../../assets/lender/sabadell.png'
import Guapo from '../../../assets/lender/Guapo.png'
import Caixa from '../../../assets/lender/caixa.png'
import Bbca from '../../../assets/lender/bbca.png'
import Bancopopular from '../../../assets/lender/bancopopular.png'
import Bancodespain from '../../../assets/lender/bancodespain.png'
import Banca from '../../../assets/lender/banca.png'
import Abanca from '../../../assets/lender/abanca.png'

interface LenderProps {}

const Lender: React.FunctionComponent<LenderProps> = () => {
  const banks = [
    {
      id: "1",
      Image: Ibercaja,
      topElipseBottom:"none",
      topElipseright:"0px",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"-10px",
      bottomElipseright:"none",
      bottomElipseLeft:"-10px",
      bottomElipseTop:"none",
      bottomDisplay:"flex",
      topColor:"#0066B3",
      bottomColor:"#0066B3",
      topDisplay:"flex"
    },
    {
      id: "2",
      Image: Guapo,
      topElipseBottom:"none",
      topElipseright:"0px",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"-10px",
      bottomElipseright:"none",
      bottomElipseLeft:"-10px",
      bottomElipseTop:"none",
      bottomDisplay:"none",
      topColor:"#C7DB54",
      bottomColor:"#C7DB54",
      topDisplay:"flex"
    },
    {
      id: "3",
      Image: Banca,
      topElipseBottom:"none",
      topElipseright:"none",
      topElipseLeft:"0px",
      topElipseTop:"-2px",
      bottomElipseBottom:"10px",
      bottomElipseright:"-5px",
      bottomElipseLeft:"none",
      bottomElipseTop:"none",
      bottomDisplay:"flex",
      topColor:"#0066B3",
      bottomColor:"#C7DB54",
      topDisplay:"flex"
    },
    {
      id: "4",
      Image: Sabadell,
      topElipseBottom:"none",
      topElipseright:"0px",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"-10px",
      bottomElipseright:"none",
      bottomElipseLeft:"-10px",
      bottomElipseTop:"none",
      bottomDisplay:"none",
      topColor:"#C7DB54",
      bottomColor:"#C7DB54",
      topDisplay:"flex"
    },
    {
      id: "5",
      Image: Bancodespain,
      topElipseBottom:"none",
      topElipseright:"50%",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"-10px",
      bottomElipseright:"none",
      bottomElipseLeft:"10px",
      bottomElipseTop:"none",
      bottomDisplay:"none",
      topColor:"#0066B3",
      bottomColor:"#C7DB54",
      topDisplay:"flex"
    },
    {
      id: "6",
      Image: Abanca,
      topElipseBottom:"none",
      topElipseright:"50%",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"10px",
      bottomElipseright:"5px",
      bottomElipseLeft:"none",
      bottomElipseTop:"none",
      bottomDisplay:"flex",
      topColor:"#0066B3",
      bottomColor:"#0066B3",
      topDisplay:"none"
    },
    {
      id: "7",
      Image: Bbca,
      topElipseBottom:"none",
      topElipseright:"50%",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"10px",
      bottomElipseright:"none",
      bottomElipseLeft:"-5px",
      bottomElipseTop:"none",
      bottomDisplay:"flex",
      topColor:"#0066B3",
      bottomColor:"#0066B3",
      topDisplay:"none"
    },
    {
      id: "8",
      Image: Bancopopular,
      topElipseBottom:"none",
      topElipseright:"50%",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"-14px",
      bottomElipseright:"none",
      bottomElipseLeft:"15px",
      bottomElipseTop:"none",
      bottomDisplay:"flex",
      topColor:"#0066B3",
      bottomColor:"#F76900",
      topDisplay:"none"
    },
    {
      id: "9",
      Image: Guapo,
      topElipseBottom:"none",
      topElipseright:"50%",
      topElipseLeft:"none",
      topElipseTop:"0px",
      bottomElipseBottom:"-14px",
      bottomElipseright:"10px",
      bottomElipseLeft:"none",
      bottomElipseTop:"none",
      bottomDisplay:"flex",
      topColor:"#0066B3",
      bottomColor:"#0066B3",
      topDisplay:"none"
    },
  ];

  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(false);

  return (
    <div className="lenderWrapper">
      <LenderHeader setIsRightDrawerOpen={setIsRightDrawerOpen} />
      {isRightDrawerOpen && (
        <Drawer
          placement="right"
          open={isRightDrawerOpen}
          closeIcon={<CloseIcon />}
          onClose={() => setIsRightDrawerOpen(false)}
          className="lenderDrawer"
          width="41rem"
        >
          <p className="banksHead">Banks</p>
          <div className="smallBanksContainer">
            {banks.map((bank) => (
              <LenderBankCard key={bank.id} small image={bank.Image} />
            ))}
          </div>
        </Drawer>
      )}
      <div className="lendContainer">
        <p className="lendTxt">
          The best offers from the leading banks of the country
        </p>
        <div className="blueLineGradient"></div>
        <p className="lndRemTxt">
          To find out the terms of cooperation, select a bank
        </p>
        <div className="banksWrapper">
          {banks.map((bank) => (
            <LenderBankCard key={bank.id} 
            image={bank.Image} 
            topElipseBottom={bank.topElipseBottom}
            topElipseright={bank.topElipseright}
            topElipseLeft={bank.topElipseLeft}
            topElipseTop={bank.topElipseTop}
            bottomElipseBottom={bank.bottomElipseBottom}
            bottomElipseright={bank.bottomElipseright}
            bottomElipseLeft={bank.bottomElipseLeft}
            bottomElipseTop={bank.bottomElipseTop}
            topColor={bank.topColor}
            topDisplay={bank.topDisplay}
            bottomDisplay={bank.bottomDisplay}
            bottomColor={bank.bottomColor}
            />
          ))}
         
        </div>
      </div>
    </div>
  );
};

export default Lender;
