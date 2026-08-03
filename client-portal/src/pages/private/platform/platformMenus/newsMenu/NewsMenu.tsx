import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Button } from "antd";
import moment from "moment";

import { useNews } from "api/news/useNews";
import Loading from "components/loading";

import ArrowsSlider from "../../../../../components/arrowsSlider/ArrowsSlider";
import "./newsMenu.scss";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import {  NewsIcon, SearchIcon2, TimerIcon } from "../../../../../assets/icons";
import { useAppSelector } from "@store/hooks";

import { INews } from "@interfaces";
import NewsModal from "components/newsModal/newModal";

const titleHandler = (titleKey: string) => {
  switch (titleKey) {
    case "Forex":
      return "Forex";
    case "all":
      return "All";
    case "Stocks":
      return "Stocks";
    case "Commodities":
      return "Commodities";
    case "Crypto":
      return "Crypto";
    default:
      return "";
  }
};


const RenderTab = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [part1, part2] = description.split(" on ");
  return (
    <div className="newsMenuWrapper">
      <p className="newsHeading capitalize">{title}</p>
      <div className="newsIconWrapper">
        <NewsIcon />
      </div>
      <p className="noNews">{part1} on</p>
      <p className="noNews">{part2}</p>
    </div>
  );
};

interface NewsFeedProps {
  articles: Record<string, INews>;
  label: string;
  searchTerm: string; 

}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, label, searchTerm }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<INews | null>(null);

  const handleArticleClick = (article: INews) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };
  
  const selectedArticles = Object.values(articles || {}).filter((article) =>
    article?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article?.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      {selectedArticles.length > 0 ? (
        selectedArticles.map((item, index) => (
          <div
            key={index}
            onClick={() => handleArticleClick(item)}
            className="textContainer cursor-pointer"
          >
            <h2>{item?.title?.substring(0, 65)}</h2>
            <p>{item?.text ? `${item?.text?.substring(0, 190)}...` : ""}</p>
            <div className="textFooter">
              <TimerIcon />
              <span className="text-[#2dd674]"> 15 min Read</span>
            </div>
          </div>
        ))
      ) : (
        <RenderTab title={`${label} News`} description={`No News on ${label}`} />
      )}

      {selectedArticle && (
        <NewsModal
          open={modalOpen}
          setOpen={setModalOpen}
          closable={true}
          article={selectedArticle}
          label={label}
        />
      )}
    </>
  );
};



interface NewsMenuProps {}

const NewsMenu: React.FunctionComponent<NewsMenuProps> = () => {
  const [cookies] = useCookies(["access_token"]);
  const [selectedFeed, setSelectedFeed] = useState("all");
  const { themeSelect } = useAppSelector((state) => state.themeBg);
  const [searchTerm, setSearchTerm] = useState("");
  const requestedForToken = useRef<string | null>(null);

  const result = useNews({
    onSuccess: () => console.log("returned success"),
    onError: () => {},
  });

  const { mutate: mutateNews, data, isPending } = result;

  const items = [
    { id: "1", tab: "all", label: "all feed" },
    { id: "2", tab: "Forex", label: "forex feed" },
    { id: "3", tab: "Stocks", label: "stock feed" },
    { id: "4", tab: "Commodities", label: "commodities feed" },
    { id: "5", tab: "Crypto", label: "crypto feed" },
  ];

  const handleNewsSelection = (feed: any) => {
    setSelectedFeed(feed.tab);
    if (feed.queryParams) {
      mutateNews({
        token: cookies.access_token,
        queryParams: feed.queryParams,
      });
    }
  };

  useEffect(() => {
    if (cookies.access_token && requestedForToken.current !== cookies.access_token) {
      requestedForToken.current = cookies.access_token;
      mutateNews({ token: cookies.access_token });
    }
  }, [mutateNews, cookies.access_token]);

  if (isPending) {
    return <Loading />;
  }

  

const getSelectedArticles = (): Record<string, INews> => {
  const articles = Array.isArray(data?.results) ? data.results : [];
  const filtered = selectedFeed === "all"
    ? articles
    : articles.filter((article) =>
        article.category?.some((category) => category.toLowerCase() === selectedFeed.toLowerCase())
      );
  return Object.fromEntries(filtered.map((article) => [article.article_id, article]));
};

  const selectedArticles = getSelectedArticles();

  return (
    <div className={`${themeSelect} newsMenu`}>
      <div className="payment-methods-filter-btns">
        <ArrowsSlider>
          {items.map((item) => (
            <Button
              className={`${selectedFeed === item.tab ? "active" : ""} payment-methods-filter-btn`}
              key={item.tab}
              onClick={() => handleNewsSelection(item)}
            >
              {titleHandler(item.tab)}
            </Button>
          ))}
        </ArrowsSlider>
      </div>

      <div className="searchContainer">
        <MainItemCard variant={2}>
          <div className="inputSearch">
          
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              <SearchIcon2 />
            </div>
          </div>
        </MainItemCard>
      </div>

      <div className="news-content">
        <NewsFeed articles={selectedArticles} label={selectedFeed} searchTerm={searchTerm}/>
      </div>
    </div>
  );
};

export default NewsMenu;
