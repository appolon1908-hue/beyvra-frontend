import  { FC } from 'react';

import { Button } from 'antd';

import "./MagicBoxCard.scss";

interface MagicBoxCardProps {
  boxImage: string;
  btnAction: () => void;
}

const MagicBoxCard: FC<MagicBoxCardProps> = ({ boxImage, btnAction }) => {
  return (
    <>
      <div className="card-container">
        <div className="magic-card-text">
          <p className="referalRewardsText">REFERAL REWARDS</p>
          <p className="megabox-text">MegaBox</p>
          <Button onClick={btnAction}>What’s Inside?</Button>
        </div>
        <div className="magicBoxImage">
          <img src={boxImage} alt="Box Image" />
        </div>
      </div>
    </>
  );
};

export default MagicBoxCard