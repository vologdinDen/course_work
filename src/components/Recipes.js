import React, {useState, useEffect} from "react";
import RecipeDetail from "./RecipeDetail";

import { Button } from "react-bootstrap";
import { Star } from 'react-bootstrap-icons';

const Recipes = ({recipe}) => {
    const [show, setShow] = useState(false);
    const [inFavorite, setInFavorite] = useState(false);
    const {label, image, url, ingredients} = recipe.recipe;

    const addToFavorite = () => {
        if (localStorage.getItem("Favorite") !== null){        
            const previos = JSON.parse(localStorage.getItem("Favorite"));
            previos[label] = url;
            localStorage.setItem("Favorite", JSON.stringify(previos));
        }else{
            const newJson = new Object();
            newJson[label] = url;
            localStorage.setItem("Favorite", JSON.stringify(newJson));
        }
        setInFavorite(true);
    }

    const deleteFromFavorite = () => {
        const previos = JSON.parse(localStorage.getItem("Favorite"));
        delete previos[label];
        localStorage.setItem("Favorite", JSON.stringify(previos));
        setInFavorite(false);
    }

    useEffect(() => {
        const previos = JSON.parse(localStorage.getItem("Favorite"));
        if(previos !== null && previos.hasOwnProperty(label)){
            setInFavorite(true);
        }
    }, [label])
    
    return (
        <div className="recipe">
            <div className="recipe-head">
            {!inFavorite ? (<Button type='button' variant="light" size="sm" onClick={addToFavorite}>
                <Star className="star-image"></Star>
            </Button>) : (
                <Button type='button' variant="warning" size="sm" onClick={deleteFromFavorite}>
                    <Star className="star-image"></Star>
                </Button>
            )}
            <h2>{label}</h2>
            </div>
            <img src={image} alt={label}/>
            <a href={url} target="_blank" rel="noopener noreferrer">Read more...</a>
            <button className="ingredients-button" onClick={() => setShow(!show)}>Ingredients</button>
            {show && <RecipeDetail ingredients={ingredients} />}
        </div>
    )
}

export default Recipes