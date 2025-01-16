import { Dot } from "assets/icons"
import './regulationCard.scss'

interface RegulationCardProps{
  
    title: string,
    list: Array<string>
  
}
const RegulationCard: React.FC<RegulationCardProps> = ({ title,list }) => {
  return (
    <div className="regulationCardContainer">
   
          <h2>{title}</h2>
          <div className="regulationListContainer">
            {list.map((li, idx) => (
              <div className="regulationItem" key={idx}>
                <Dot color="#999999" height="20px" width="20px" />
                <p>{li}</p>
              </div>
            ))}
          </div>
        </div>
    
  );
};



export default RegulationCard