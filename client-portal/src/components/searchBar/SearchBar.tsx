import { Input } from "antd";
import { SearchLargeIcon } from "../../assets/icons";
import MainItemCard from "../mainItemCard/MainItemCard";
import "./searchBar.scss";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  extraSpacing?: boolean;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  placeholder = "Search",
  className,
  extraSpacing,
}) => {
  return (
    <MainItemCard
      className={`searchBar ${className ? className : ""} ${
        extraSpacing ? "extraSpacing" : ""
      }`}
      variant={2}
    >
      <Input placeholder={placeholder} />
      <div className="searchIcon">
        <SearchLargeIcon />
      </div>
    </MainItemCard>
  );
};

export default SearchBar;
