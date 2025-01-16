import React from 'react'
import './profileCard.scss'
import { Card, Col, Row } from 'antd'
import pic from '../../../../../assets/trading/profile-pic.jpeg'
const ProfileCard = () => {
  return (
    <Card className='profile-card'> 
        <Row gutter={[20, 10]} className='profile-top'>
            <Col span={12} className='profile-pic'>
            <div className='image-wrapper'>
            <img src={pic} alt="" />

            </div>
            </Col>
            <Col span={12} className='info'>
                <h3>Lana Pieri</h3>
                <div className='info-value'>
                    <p>Total PNL</p>
                    <span>+6,103</span>
                </div>
                <div className='info-value'>
                    <p>Total ROI</p>
                    <span>+89</span>
                </div>

                <p className='followers'>Followers: 300</p>
                <p className='followers'>Users who Copy: 210</p>
            </Col>
        </Row>
        <div className='profile-buttons'>
            <button className='copy'>Copy</button>
            <button>Follow</button>
        </div>
        <Row gutter={[10,10]} className='profile-bottom'>
            <Col span={8} className='stat'>
            <span>7D ROI</span>
            <p> +67</p>
            </Col>
            <Col span={7} className='stat'>
            <span>7D PNL</span>
            <p> +4,279</p>
            </Col>
            <Col span={9} className='stat'>
            <span>WIN RATE</span>
            <p> 23%</p>
            </Col>
        <Col span={8} className='stat'>
            <span>Min Amount</span>
            <p> 20 EUR</p>
            </Col>
            <Col span={7} className='stat'>
            <span>MDD</span>
            <p> +23%</p>
            </Col>
            <Col span={9} className='stat'>
            <span>WINNING POSITIONS</span>
            <p> +4279</p>
            </Col>
        </Row>
    </Card>
  )
}

export default ProfileCard