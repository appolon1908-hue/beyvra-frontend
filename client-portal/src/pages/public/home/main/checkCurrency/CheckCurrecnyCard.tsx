
interface CheckCurrencyCardTypes{
  imgSrc: string;
  name: string;
  price: string;
  trade: string;
  tradeColor: string;
}

const CheckCurrecnyCard:React.FC<CheckCurrencyCardTypes> = ({
  imgSrc,
  name,
  price,
  trade,
  tradeColor,
}) => {

  return (
    <div className='checkCurrencyCardContainer'>
        <div className='checkCurrencyCardLeftItmes'>
            <div className='checkCardImageWrapper'>
              <img src={imgSrc} alt="" />
            </div>
            <span>{name}</span>
        </div>
        <div className='checkCurrencyCardRightItmes'>
            <h2>{price}</h2>
            <p style={{color:tradeColor}}>{trade}</p>
        </div>
    </div>
  )
}

export default CheckCurrecnyCard