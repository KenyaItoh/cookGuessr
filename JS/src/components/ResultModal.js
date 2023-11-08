import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

import TweetButton from './TweetButton';

function ResultModal({modalShow, setModalShow, currentProblem, getNewProblem, instruction}) {
  
  const handleClose = () => {
    setModalShow(false);
    getNewProblem();
  }

  console.log(currentProblem);
  return (
    <>
      <Modal show={modalShow} onHide={()=>setModalShow(false)}>
        <Modal.Header>
          <Modal.Title>{instruction}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Image src={currentProblem.answer_img_url} fluid/>
            <TweetButton instruction={instruction} url={currentProblem.answer_url}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setModalShow(false)}>
            閉じる
          </Button>
          <Button variant="success" onClick={handleClose}>
            新しい問題
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResultModal;