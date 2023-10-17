import './App.css';
import Ingredient from './components/Ingredient';
import Alternatives from './components/Alternatives';
import Loading from './components/Loading';

import { useEffect, useState } from "react"
import axios from "axios"

const API_SERVER_URL =  "https://skilful-rig-401216.an.r.appspot.com/" + "alternative/"; //"http://localhost:5000/alternative/";
const MAX_MEMO_PROBLEMS = 10;

function App() {

  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [answerDisplay, setAnswerDisplay] = useState(false);
  const [author, setAuthor] = useState("");
  const [authorDesc, setAuthorDesc] = useState("");
  const [url, setUrl] = useState("");
  const [problemList, setProblemList] = useState([]);

  const alternativeOnClick = (e) => {

    const obj = problemList[problemList.length-1];

    if (e.target.value == obj.answer + 1){
      setInstruction(<span style={{color:"red"}}><b>〇正解　答え：{obj.answer+1}. {obj.answer_title}</b></span>);
    }
    else {
      setInstruction(<span style={{color:"darkblue"}}><b>×不正解　答え：{obj.answer+1}. {obj.answer_title}</b></span>);
    }

    const alternative_list = obj.title_list.map(
      (title, idx) => {
        return <Alternatives 
          key={title} 
          idx={idx+1} 
          title={title} 
          disabled={true}
          href={obj.url_list[idx]}
        />
      }
    );
    
    if (obj.answer+1 !== 5){
      alternative_list.push(<Alternatives key="1~4以外" idx={5} title="1~4以外" disabled={true} />);
    }
    else {
      alternative_list.push(<Alternatives key={obj.answer_title} idx={5} title={obj.answer_title} disabled={true} href={obj.answer_url}/>);
    }
    
    setAlternatives(
      alternative_list
    );
  }

  useEffect(()=>{
    //console.log(problemList);
    showProblem();
  }, [problemList]);


  const showProblem = () => {
    if (problemList.length == 0){
      setInstruction(<b>問題を読み込んでください</b>)
    }
    else {
      const obj = problemList[problemList.length-1];
      setIngredients(
        obj.names.map(
          (name, idx) => {
            return <Ingredient key={idx} ingredient_name={name} quantity={obj.quantities[idx]}/>
          }
        )
      )

      setInstruction(
        <b>答えを選択してください</b>
      )

      const alternative_list = obj.title_list.map(
        (title, idx) => {
          return <Alternatives 
            key={title} 
            idx={idx+1} 
            title={title} 
            disabled={false}
            clicked={alternativeOnClick}
          />
        }
      );

      alternative_list.push(<Alternatives 
        key="1~4以外" idx={5} 
        title="1~4以外" 
        disabled={false} 
        clicked={alternativeOnClick}
      />)

      setAlternatives(
        alternative_list
      )
    }
  }


  const getPrevProblem = () => {
    if (problemList.length === 0){

    }
    else if (problemList.length === 1){
      setInstruction(<b>これ以上前の問題に戻れません</b>)
    }
    else {
      problemList.pop();
      setProblemList([...problemList]);
    }
    
    //showProblem();
  }

  const getNewProblem = () => {
    setLoading(true);
    axios
      .post(API_SERVER_URL, {
        
      })
      .then(response => {
          setLoading(false);
          problemList.push(response.data);
          if (problemList.length > MAX_MEMO_PROBLEMS) {
            problemList.splice(0,1);
          }
          setProblemList([...problemList]);
      })
  }

  return (
    <>
      {loading && <Loading />}
      <div className="App">
        <h1>cookGuessr</h1>
        <p>ルール：材料と分量から料理名を当てよう</p>
        <table border={3} align='center' className='ingredient-table'>
          <thead>
            <tr>
              <th>材料</th>
              <th>分量</th>
            </tr>
          </thead>
          <tbody className='ingredient-table-body'>
            {ingredients}  
          </tbody>
        </table>

        <div className='instruction-container'>
          {instruction}
        </div>

        <div className='alternative-table'>
          {alternatives}
        </div>

        <div className='problem-change-button-container'>
          <button className="problem-change-button" onClick={getPrevProblem}>前の問題</button>
          <button className="problem-change-button" onClick={getNewProblem}>新しい問題</button>
        </div>
      </div>
    </>
  );
}

export default App;
