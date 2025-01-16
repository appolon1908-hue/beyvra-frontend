import React from "react";
import Stories from "react-insta-stories";
import Modal, { ModalProps } from "../../../../../../../components/modal/Modal";
import {
  ReactInstaStoriesProps,
  Story,
} from "react-insta-stories/dist/interfaces";
import "./stories.scss";

interface InstaStoriesModalProps extends ModalProps, ReactInstaStoriesProps {
  stories: Story[];
  currentIndex?: number;
  modalKey?: number;
}

const StoriesModal: React.FC<InstaStoriesModalProps> = ({
  stories,
  currentIndex,
  modalKey,
  ...modalProps
}) => {
  return (
    <>
      <Modal rootClassName="storiesModal" {...modalProps}>
        {stories ? (
          <Stories
            preloadCount={0}
            width="100%"
            height="100%"
            stories={stories}
            currentIndex={currentIndex}
            key={modalKey}
            loop={true}
            storyStyles={{
              display: "flex",
              alignItems: "center",
              borderRadius: "0.625rem",
              overflow: "hidden",
            }}
            storyContainerStyles={{ backgroundColor: "transparent" }}
            progressContainerStyles={{ marginTop: "-1.25rem", padding: "0" }}
            progressStyles={{ backgroundColor: "#ffffff" }}
            progressWrapperStyles={{
              backgroundColor: "#4E4C4F",
              height: "5px",
            }}
          />
        ) : null}
      </Modal>
    </>
  );
};

export default StoriesModal;
