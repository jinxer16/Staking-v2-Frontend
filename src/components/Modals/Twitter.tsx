import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "350px",
    maxWidth: "500px",
    maxHeight: "95vh",
    border: 0,
    borderRadius: "20px",
  },
};

const { forwardRef, useRef, useImperativeHandle } = React;

interface DepositModalProps {}

const Twitter: React.FC<DepositModalProps> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(true);
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setIsOpen(true);
    },
  }));

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <Modal
      // parentSelector={() => document.querySelector('.farmpoolcard')}
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="claimmodelouter twittermodal">
        <img src="images/logo2.png" className="logo" alt="" />
        <i className="fas fa-times" onClick={() => closeModal()}></i>
        <h4>Twitter Feed</h4>
        <div className="twitterfeedinner">
          <a
            className="twitter-timeline"
            href="https://twitter.com/Tif_Finance?ref_src=twsrc%5Etfw"
          ></a>
        </div>
      </div>
    </Modal>
  );
});

export default Twitter;
