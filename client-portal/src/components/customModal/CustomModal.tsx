import './customModal.scss'

const CustomModal = () => {
  return (
    <div className='customModalWrapperContainer' style={{zIndex:'10000'}}>
      <div className='customModalFlexContainer'>
        <div className='customModalContainer'>
          <h2>Deposit Confirmation</h2>
          <div className='customModalDescriptionContainer'>

          <div className='customModalTopHeaderTittle'>
            <span>Your Deposit is Confirmed</span>
            <span>Deposit ID: 238409595</span>
          </div>
          <div className='customModalMiddleHeaderTitle'>
            <div className='customModalDepositContainer'>
                <div className='customModalSpanTitle'>
                  <span className='customModalGreyButton'>Deposit amount:</span>
                  <span className='customModalPrice'>5000$</span>
                </div>
                <div className='customModalSpanTitle'>
                  <span className='customModalGreyButton'>Date:</span>
                  <span className='customModalPrice'>20.08.2024</span>
                </div>
            </div>
                <div className='customModalSpanTitle'>
                  <span className='customModalGreyButton'>Deposit method:</span>
                  <span className='customModalPrice'>Online payment</span>
                </div>
          </div>

          </div>
          <div className='customModalFooterButtons'>
            <button>View Balance</button>
            <button>Continue Trading</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CustomModal