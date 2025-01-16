import "./twoFactorMenu.scss";

interface TwoFactorCardProps {
  name: string;
  image: string;
}

const TwoFactorCard: React.FunctionComponent<TwoFactorCardProps> = ({
  name,
  image,
}) => {
  return (
    <div className="twofactorCardWrapper">
      <div className="twofactorContent">
        <img src={image} alt={name} />
        <p className="twofactorCardTitle">{name}</p>
      </div>
    </div>
  );
};

export default TwoFactorCard;
