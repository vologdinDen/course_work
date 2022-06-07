import {React} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './Story.css';
import { Button } from 'react-bootstrap';


function Story(){
    
    const story = JSON.parse(localStorage.getItem("History"));

    return(
        <>
        <div className="App">
            <h1>Recipe Search APP</h1>
            <h2>Click on the button to save the history to the clipboard</h2>
            {story !== null && story.length > 0 ? (story.map((node, index) => (
                <li key={index}>
                <div className="story-zone">
                   <Button type="button"  variant="success" size='lg' onClick={() => {navigator.clipboard.writeText(node)}}>
                       <div className="button-text">{node}</div>
                    </Button>
                </div>
            </li>
            ))) : (
                <h2>You haven't searched for anything yet!</h2>
            )}
        </div>
        </>
    )
}

export default Story;
