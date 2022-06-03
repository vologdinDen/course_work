import React from "react";

const Alert = ({alert}) => {
    return(
        <div className="alert-message">
            <h3>{alert}</h3>
        </div>
    );
}

export default Alert;