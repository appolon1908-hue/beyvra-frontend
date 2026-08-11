import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Button } from "antd";

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
    case "latest": return "Latest";
    case "market": return "Market";
    case "crypto":
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
  articles: INews[];
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
  
  const selectedArticles = articles.filter((article) =>
    (article.headline || article.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.summary || article.text || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      {selectedArticles.length > 0 ? (
        selectedArticles.map((item, index) => (
          <div
            key={item.news_id || item.article_id || index}
            onClick={() => handleArticleClick(item)}
            className="textContainer cursor-pointer"
          >
            <h2>{(item.headline || item.title || "").substring(0, 120)}</h2>
            <p>{(item.summary || item.text || "").substring(0, 240)}</p>
            <div className="textFooter">
              <TimerIcon />
              <span>{item.source_name || item.publisher || "News source"}</span>
              {item.delayed && <span className="news-delay-label">Delayed news</span>}
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
  const [selectedFeed, setSelectedFeed] = useState<"latest" | "market" | "crypto">("latest");
  const { themeSelect } = useAppSelector((state) => state.themeBg);
  const [searchTerm, setSearchTerm] = useState("");
  const requestedForToken = useRef<string | null>(null);

  const result = useNews({
    onSuccess: () => console.log("returned success"),
    onError: () => {},
  });

  const { mutate: mutateNews, data, isPending } = result;

  const items = [
    { id: "1", tab: "latest" as const, label: "latest feed" },
    { id: "2", tab: "market" as const, label: "market feed" },
    { id: "3", tab: "crypto" as const, label: "crypto feed" },
  ];

  const handleNewsSelection = (feed: any) => {
    setSelectedFeed(feed.tab);
    mutateNews({ token: cookies.access_token, feed: feed.tab });
  };

  useEffect(() => {
    if (cookies.access_token && requestedForToken.current !== cookies.access_token) {
      requestedForToken.current = cookies.access_token;
      mutateNews({ token: cookies.access_token, feed: "latest" });
    }
  }, [mutateNews, cookies.access_token]);

  if (isPending) {
    return <Loading />;
  }

  

const getSelectedArticles = (): INews[] => Array.isArray(data?.results) ? data.results : [];

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
        {data?.delayed && <p className="news-delay-disclosure">Delayed news</p>}
        <NewsFeed articles={selectedArticles} label={selectedFeed} searchTerm={searchTerm}/>
      </div>
    </div>
  );
};

export default NewsMenu;
