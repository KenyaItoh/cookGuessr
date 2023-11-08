import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Button from 'react-bootstrap/Button';

import './App.css';
import IngredientTable from './components/IngredientTable';
import Instruction from "./components/Instruction";
import AlternativeTable from './components/AlternativeTable';
import Loading from './components/Loading';
import ResultModal from "./components/ResultModal";



//const API_SERVER_URL =  "https://skilful-rig-401216.an.r.appspot.com/" + "alternative/";
const API_SERVER_URL = "http://localhost:5000/alternative/";
const MAX_MEMO_PROBLEMS = 10;

function App() {

  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState(() => <b>問題を読み込んでください</b>);
  const [isSolving, setIsSolving] = useState(false);
  const [currentProblem, setCurrentProblem] = useState({names:[], quantities:[], title_list:[],});
  const problemListRef = useRef([]);
  const [modalShow, setModalShow] = useState(false);

  // useEffect(()=>{
  //   getNewProblem();
  // }, [])

  const makeIngredients = currentProblem =>{
    return currentProblem.names.map(
      (name, idx) => {
        return {
          name: name,
          quantity: currentProblem.quantities[idx],
        }
      }
    )
  }

  const alternativeButtonOnClick = idx => {
    //正誤確認
    const cp = currentProblem;
    if (currentProblem.answer === idx){
      setInstruction(<span style={{color:"red"}}><b>〇正解　答え：{cp.answer+1}. {cp.answer_title}</b></span>);
    }
    else {
      setInstruction(<span style={{color:"darkblue"}}><b>×不正解 答え：{cp.answer+1}. {cp.answer_title}</b></span>);
    }

    //isSolving変更
    setIsSolving(false);
    setModalShow(true);

  }

  const makeAlternatives = currentProblem => {
    return currentProblem.title_list.map( (title, idx) => {
      return {
        idx: idx,
        title: title,
        href: currentProblem.url_list[idx],
        clicked: alternativeButtonOnClick
      }
    })
  }

  const getPrevProblem = () => {
    if (problemListRef.current.length === 0){
    }
    else if (problemListRef.current.length === 1){
      setInstruction(<b>これ以上前の問題に戻れません</b>)
    }
    else {
      problemListRef.current.pop();
      setCurrentProblem(problemListRef.current[problemListRef.current.length-1]);
      setInstruction(<b>答えを選択してください</b>);
      setIsSolving(true);
    }
  }

  const getNewProblem = () => {
    setLoading(true);
    axios
      .post(API_SERVER_URL, {  
      })
      .then(response => {
          setLoading(false);
          const problemData = response.data;
          problemData.title_list.push("1~4以外");
          problemData.url_list.push(problemData.answer == 4 ? problemData.answer_url : void(0));

          problemListRef.current.push(problemData);
          if (problemListRef.current.length > MAX_MEMO_PROBLEMS) {
            problemListRef.current.splice(0,1);
          }
          setInstruction(<b>答えを選択してください</b>);
          setCurrentProblem(problemListRef.current.slice(-1)[0]);
          setIsSolving(true);
          
      })
  }

  return (
    <>
      {loading && <Loading />}
      <div className="App">
        <h1>cookGuessr</h1>
        <p>ルール：材料と分量から料理名を当てよう</p>
        <IngredientTable ingredients={makeIngredients(currentProblem)} />
        <Instruction instruction={instruction} />
        <AlternativeTable alternatives={makeAlternatives(currentProblem)} isSolving={isSolving}/>
        <div className='problem-change-button-container'>
          <Button className="problem-change-button" variant="secondary" onClick={getPrevProblem}>前の問題</Button>
          <Button className="problem-change-button" variant="success" onClick={getNewProblem}>新しい問題</Button>
        </div>
        <ResultModal 
          modalShow={modalShow} 
          setModalShow={setModalShow}
          currentProblem={currentProblem}
          getNewProblem={getNewProblem}
          instruction={instruction}
        />
      </div>
    </>
  );
}

export default App;
