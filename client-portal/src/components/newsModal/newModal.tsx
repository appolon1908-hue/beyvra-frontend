import React, { useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { TimerIcon } from 'assets/icons';
import { useAppSelector } from '@store/hooks';
import { useNewsArticle } from 'api/news/useNewsArticle';
import { useCookies } from 'react-cookie';
import { INews } from '@interfaces';
import './newsModal.scss';
import moment from 'moment';

export interface NewsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closable: boolean;
  article?: INews;
  label: string;
}

const NewsModal: React.FC<NewsModalProps> = ({
  open,
  setOpen,
  closable,
  article,
  label,
}) => {
  const { themeSelect } = useAppSelector((state) => state.themeBg);
  const [cookies] = useCookies(['access_token']);
  const [readMore, setReadMore] = useState(false);
  const [fullArticle, setFullArticle] = useState<INews | null>(null);

  const { mutate, isPending } = useNewsArticle({
    onSuccess: (data) => {
      setFullArticle(data);
      setReadMore(true);
    },
    onError: (error) => {
      console.error('Failed to load the article:', error);
    },
  });

  const handleToggleReadMore = () => {
    if (!fullArticle && article?.article_id) {
      mutate({ token: cookies.access_token, articleId: article.article_id });
    } else {
      setReadMore((prev) => !prev);
    }
  };


  const handleClickRemindLater = () => {
   setOpen(false)
   setReadMore(false);
  }
  

  const renderContent = () => {
    if (readMore && article?.full_text ) {
      return <div className="w-full max-h-96 overflow-y-auto px-8">{article?.full_text}</div>;
    }
    return (
      <>
        <p className="max-w-xl m-auto text-center text-base">
          {article?.text ? `${article?.text?.substring(0, 190)}...` : ""}
        </p>
        {/* <p className="text-center m-auto w-max flex gap-3 my-5 text-[#0094ff]">
          <TimerIcon /> <span> 15 min Read</span>
        </p> */}
      </>
    );
  };

  return (
    <Modal
      className={themeSelect}
      open={open}
      maskClosable={true}
      width={600}
      closable={closable}
      onCancel={handleClickRemindLater}
      afterClose={() => setFullArticle(null)}
      centered
      footer={
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            key="cancel"
            onClick={handleClickRemindLater}
            style={{
              backgroundColor: '#16171A',
              color: 'white',
              padding: '7px 32px',
              height: 'max-content',
              marginRight: '7px',
            }}
          >
            Remind later
          </Button>
          <Button
            key="ok"
            type="primary"
            onClick={handleToggleReadMore}
            style={{
              backgroundColor: '#2dd674',
              color: 'black',
              padding: '7px 32px',
              height: 'max-content',
            }}
          >
            {isPending ? <Spin /> : readMore ? 'Read Less' : 'Read More'}
          </Button>
        </div>
      }
    >
      <div className={`${themeSelect} newsModal py-10 max-w-[600px]`}>
        <h2 className="font-bold text-2xl text-center my-7 capitalize">{article?.creator}</h2>
            
        <h3 className="max-w-md m-auto text-lg text-center">
          {article?.title?.substring(0, 65)}
        </h3>
        {/* <span className="max-w-md m-auto text-lg text-center">
          {article?.full_text}
        </span> */}
        {/* <h3 className="text-center text-lg font-semibold my-3">{moment(article?.pubDate).format("dd.mm.yy")}</h3> */}
        {renderContent()}
      </div>
    </Modal>
  );
};

export default NewsModal;