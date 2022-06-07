import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import MicRecorder from 'mic-recorder-to-mp3';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Mic, MicMute, Hourglass } from 'react-bootstrap-icons';

import { Form, Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

import Recipes from './components/Recipes';
import Alert from './components/Alert';

const assembly = Axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: "711f46c019f04ba8bf06ffd4f928abc7",
      "content-type": "application/json",
    },
  });

function Main() {
    const [query, setQuery] = useState("");
    const [chipsArray, setChipsArray] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [alert, setAlert] = useState("");
  
    const API_ID = "7fe28959";
    const API_KEY = "65a026ce71017d1616fae63b51dbecb1";
  
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlob] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const recoder = useRef(null);
  
    const [isSearch, setIsSearch] = useState(false);
  
  
    
    useEffect(() => {
      recoder.current = new MicRecorder({bitRate: 128});
    }, []);

    const startRecording = () => {
      setUploadUrl("");
      setAudioFile(null);
      setTranscriptData("");
      recoder.current.start().then(() => {
        setIsRecording(true);
      })
      }
    
      const stopRecording = () => {
        recoder.current
         .stop()
         .getMp3()
         .then(([buffer, blob]) => {
           const file = new File(buffer, "audio.mp3", {
             type: blob.type,
             lastModified: Date.now(),
           });
           const newBlobURL = URL.createObjectURL(blob);
           setBlob(newBlobURL);
           console.log(blobURL);
           setIsRecording(false);
           setAudioFile(file);
           setIsLoading(true);
         })
         .catch((e) => console.log(e));    
      }
    
      const [uploadURL, setUploadUrl] = useState("");
      const [transcriptID, setTranscriptID] = useState("");
      const [transcriptData, setTranscriptData] = useState("");
      const [isLoading, setIsLoading] = useState(false);
    
      useEffect(() => {
        if(audioFile){
          assembly
           .post("/upload", audioFile)
           .then((res) => setUploadUrl(res.data.upload_url))
           .catch((err) => console.error(err));
        }
      }, [audioFile]);
    
    
      const checkStatusHandler = async () => {
        setIsLoading(true);
        try{
          await assembly.get(`/transcript/${transcriptID}`).then((res) => {
            setTranscriptData(res.data);
          })
        }catch(err){
          console.error(err);
        }
      }
    
      useEffect(() => {
        if(uploadURL){   
                 
          assembly.post("/transcript", {
          audio_url: uploadURL,
          })
          .then((result) => {
            setTranscriptID(result.data.id);
            checkStatusHandler();
          }).catch((err) => console.log(err));
      }
      }, [uploadURL])
    
      useEffect(() => {
        if(isLoading){
          const interval = setInterval(() => {
            if (transcriptData.status === "completed"){
              setIsLoading(false);
              setQuery(transcriptData.text);
      

              clearInterval(interval);
            }else{
              checkStatusHandler();
            }
          }, 1000)
          return () => clearInterval(interval);
        }
      },)
    
      
      const getData = async () => {
        if(query !== ""){
          const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query + " " + chipsArray.join(" ")}&app_id=${API_ID}&app_key=${API_KEY}`;
          const result = await Axios.get(url);
          
          if(result.data.to === 0){
            setIsSearch(false);
            
            return setAlert("No ingredients with such name");
          }
          setChipsArray(existingItems => {return[...existingItems.concat(query.split(/[\s,]+/))]});
          const previos = JSON.parse(localStorage.getItem("History"));
          if(previos !== null){
              localStorage.setItem("History", JSON.stringify([...previos, query + " " + chipsArray.join(" ")]))
          }else{
              localStorage.setItem("History", JSON.stringify([query + " " + chipsArray.join(" ")]))
          }
          setRecipes(result.data.hits);
          setAlert("");
          setQuery(""); 
          setIsSearch(false);
        }else{
          setAlert("Please fill the form");
          setIsSearch(false);
        }
      };
      
      const onChange = e => {
        setQuery(e.target.value);
      };
    
      const onSubmit = e => {
        setIsSearch(true);
        e.preventDefault();
        getData();
      }
    
      const deleteChips = index => {
        setChipsArray(existingItems => {
          return[...existingItems.slice(0, index), ...existingItems.slice(index + 1)]
        })
      }
    
    
      const text_handle = (event) =>{
        if(event.keyCode === 13){
          event.preventDefault();
        }
      }

      return(
        <div className="App">
        <h1>Recipe Search APP</h1>
        <div className='search-container'>
          {alert !== "" && <Alert alert={alert}/>}
          <Form>
            <Form.Group>
              <Form.Control type="text" placeholder='Input your ingredients' onChange={onChange} value={query} onKeyDown={text_handle}></Form.Control>
            </Form.Group>
          </Form>
  
          {!isRecording ? (
            <Button type="button" variant='ligth' onClick={!isLoading ? startRecording : null}>
              {!isLoading ? <MicMute className='micro-image'/> : <Hourglass className='hourglass-image'/>}
            </Button>
          ) : (
            <Button type="button" variant='ligth' onClick={stopRecording}>
              <Mic className='micro-image'/>
            </Button>
          )}
          
          <Button type='button' variant='success' onClick={!isSearch? onSubmit : null}>
            {isSearch ? 'SEARCHING...': 'SEARCH'}
          </Button>   
                  
        </div>
        <div className='chips-zone'>
          {chipsArray !== [] && chipsArray.map((el, index) =>
            <Badge pill bg="secondary">
              {el}
              <Button variant='secondary' size='sm' onClick={(e) => deleteChips(index)}>X</Button>
            </Badge>
          )}
        </div>
        <div className='recipes'>
          {recipes !== [] && recipes.map(recipe => 
            <Recipes key={uuidv4()} recipe={recipe} />)}
        </div>
      </div>
      )
}

export default Main;