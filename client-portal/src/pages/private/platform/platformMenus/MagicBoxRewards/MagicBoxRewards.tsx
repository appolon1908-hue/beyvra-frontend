import { FC } from 'react'
import { Typography } from "antd";
import "./MagicBoxRewards.scss";

interface MagicBoxRewardsProps {}

const MagicBoxRewards: FC<MagicBoxRewardsProps> = () => {

  return (
    <div>
      <div className="magicBoxContainer">
        <div className="magic-box-image-box">
          <img src="/menu-images/squared-3d-treasure-box.png" alt="Magic Box" />
          <Typography.Text>MegaBox</Typography.Text>
        </div>
      </div>
      <div className="magic-box-text-box">
        <p>
          This Boost Cube contains several randomly selected items from the list
          below
        </p>
      </div>
      <div className="magic-box-possible-rewards">
        <Typography.Text className="rewards-title">
          Possible Rewards
        </Typography.Text>
        {/* XP Rewards */}
        <div className="profileCard reward-btn" style={{ marginTop: "1rem" }}>
          <button className="settings">
            <div>
              <img src="/menu-images/xpRewardIcon.png" />
            </div>
            <div>
              <p className="txt reward-key">XP</p>
              <p className="txt reward-value">Up to 200,00</p>
            </div>
          </button>
        </div>
        {/* Risk-free Trades Rewards */}
        <div className="profileCard reward-btn">
          <button className="settings">
            <div>
              <img src="/menu-images/blue-3d-shield.png" />
            </div>
            <div>
              <p className="txt reward-key">Risk-free Trades</p>
              <p className="txt reward-value">Up to $150</p>
            </div>
          </button>
        </div>
        {/* Strategy Rewards */}
        <div className="profileCard reward-btn">
          <button className="settings">
            <div>
              <img src="/menu-images/blue-3d-strategy-icon.png" />
            </div>
            <div>
              <p className="txt reward-key">Strategy</p>
              <p className="txt reward-value">From Advanced or Expert Status</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagicBoxRewards