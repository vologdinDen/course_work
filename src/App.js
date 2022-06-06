import React, { useState, useEffect, useRef } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navibar from './components/Navibar';

import Main from './Main'
import Favorite from './Favorite'
import Story from './Stoty'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';


function App() {
  
 
  
  return (
    <>
      <Router>
        <Navibar></Navibar>
        <Routes>
          <Route path="/" element={<Main></Main>} />
          <Route path="/favorite" element={<Favorite></Favorite>} />
          <Route path="/story" element={<Story></Story>} />
        </Routes>
      </Router>
   
  </>
  );
}

export default App;
