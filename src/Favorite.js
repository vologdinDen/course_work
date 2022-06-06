import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import { Star } from 'react-bootstrap-icons';


function Favorite(){

    const [favoriteRecipe, setFavoriteRecipe] = useState(JSON.parse(localStorage.getItem("Favorite")));

    const deleteFromFavorite = (label) => {
        const previos = JSON.parse(localStorage.getItem("Favorite"));
        delete previos[label];
        setFavoriteRecipe(previos);
        localStorage.setItem("Favorite", JSON.stringify(previos));
    }

    return(
        <div className="App">
        <h2>Your favorite recipes</h2>
        <div className="recipes">
            {Object.keys(favoriteRecipe).map((key) => (
                <div className="favorite-recipe">
                    <div className="favorite-recipe-head">
                        <Button type='button' variant="warning" size="sm" onClick={(e) => deleteFromFavorite(key)}>
                            <Star className="star-image"></Star>
                        </Button>
                        <h2>{key}</h2>
                    </div>
                    <a href={favoriteRecipe[key]}>Read more...</a>
                </div>
            ))}
        </div>
        </div>
    )
}

export default Favorite;