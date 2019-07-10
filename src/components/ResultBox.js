import React from 'react';
import Close from '@material-ui/icons/Close';

//When the result state is not empty, render a box stating the user's result.
//Clicking on the close icon in the corner will reset the result state to an empty string.
const ResultBox = ({ result, clearResult }) =>
{
  return (
    <div className="resultBackground">
      <div className="resultBox">
        <p className="resultHeader">Your movie taste is...</p>
        <p className="result">{ result }!</p>
        <Close className="close" onClick={() => clearResult() }/>
      </div>
    </div>
  )
}


export default ResultBox;