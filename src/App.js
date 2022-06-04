import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import MicRecorder from 'mic-recorder-to-mp3';
import './App.css';
import micro_img from './micro_img.png';

import Recipes from './components/Recipes';
import Alert from './components/Alert';

const assembly = Axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "bc2e12595152421988bfe9aca031abf4",
    "content-type": "application/json",
  },
});


function App() {
  
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [alert, setAlert] = useState("");

  const API_ID = "7fe28959";
  const API_KEY = "0808e379aff35f5f0953944875d1b0d5";
  const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}`;

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlob] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const recoder = useRef(null);

  
  useEffect(() => {
    recoder.current = new MicRecorder({bitRate: 128});
  }, []);

  const startRecording = () => {
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
     })
     .catch((e) => console.log(e));
    
    submitTranscriptoinHandler();
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

  const submitTranscriptoinHandler = () => {
    assembly
     .post("/transcript", {
       audio_url: uploadURL,
     })
     .then((res) => {
       setTranscriptID(res.data.id);
       checkStatusHandler();
     })
     .catch((err) => console.error(err));
  }

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
    const interval = setInterval(() => {
      if (isLoading && transcriptData.status === "completed"){
        setIsLoading(false);
        setQuery(transcriptData.text);

        clearInterval(interval);
      }else if (isLoading){
        checkStatusHandler();
      }
    }, 1000)
    return () => clearInterval(interval);
  },)

  
  const getData = async () => {
    if(query !== ""){
      const result = await Axios.get(url);
      
      if(result.data.to === 0){
        return setAlert("No ingredients with such name");
      }
      
      setRecipes(result.data.hits);
      console.log(query)
      setAlert(""); 
      setQuery("")   
    }else{
      setAlert("Please fill the form");
    }
  };
  
  const onChange = e => {
    setQuery(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    getData();
  }
  
  return (
    <div className="App">
      <h1>Recipe Search APP</h1>
      <div className='search-from'>
        {isRecording && <img src={micro_img} className="microphone-image" alt="microphone"/>}
        <form className='search-form' onSubmit={onSubmit}>
          {alert !== "" && <Alert alert={alert}/>}
          <input type="text" placeholder='Input your ingredients' onChange={onChange} value={query}></input>
          <input type="submit" value="Search"></input>
        </form>
        
        <button onClick={startRecording} disabled={isRecording}>Start Recoding</button>
        <button onClick={stopRecording} disabled={!isRecording}>Stop recording</button>
        
      </div>
      <div className='recipes'>
        {recipes !== [] && recipes.map(recipe => 
          <Recipes key={uuidv4()} recipe={recipe} />)}
      </div>
    </div>
  );
}

export default App;
