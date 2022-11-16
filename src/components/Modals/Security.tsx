import { DEFAULT_CHAIN_ID } from "config";
import React from "react";
import Modal from "react-modal";
import { usePools } from "state/hooks";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "350px",
    maxWidth: "800px",
    maxHeight: "95vh",
    border: 0,
    borderRadius: "20px",
  },
};

const { forwardRef, useImperativeHandle } = React;

interface DepositModalProps {}

const Security: React.FC<DepositModalProps> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
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

  const pools = usePools()
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="claimmodelouter securitymodal">
        <img src="images/lock.png" className="logo" alt="" />
        <i className="fas fa-times" onClick={() => closeModal()}></i>
        <h4>Security Panel</h4>
        <div className="securityfeedinner">
          {
            pools.map(pool => (
              <div className="mrow">
                <img
                  src={pool.logo}
                  className="isnotpool"
                  alt=""
                />
                <div className="name">{pool.name}</div>
                <div className="address">
                  {pool.address[DEFAULT_CHAIN_ID]}
                </div>
                <button>
                  <i className="fa fa-check" aria-hidden="true"></i>6h time lock
                </button>
                <a
                  href={`https://arbiscan.io/address/0x2e1F3EFFe3A19b21E77A6bd37d1C1D6ce57C151D#code`}
                  className="border"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="images/logo-Arbiscan.png" alt="" />
                  Go to arbiscan
                </a>
            </div> 
            ))
          }
        </div>

        <div className="teamtoken">
          <b>Team Tokens</b>
          450,000
          <button>
            <i className="fa fa-check" aria-hidden="true"></i>Vested
          </button>
          <a
              href="https://arbiscan.io/tx/0x82c46aa78bd03e27a830e230f583a690303855e0b0194eda4d397aa5792bb042"
              className="border"
              target="_blank"
              rel="noreferrer"
            >
              <img src="images/logo-Arbiscan.png" alt="" />
              Go to arbiscan
            </a>
        </div>
        <img src="images/secureby.png" className="footerlogo" alt="" />
      </div>
    </Modal>
  );
});

export default Security;
