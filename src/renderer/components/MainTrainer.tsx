import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../css/trainer.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function MainTrainer() {
  const task = useSelector((state: any) => state.app.task);
  const navigate = useNavigate();
  console.log(task);

  return (
    <div className="trainer__container">
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Train</span>
        </span>
      </div>
      <div className="tc__header">
        {task}
      </div>
      <div className="progress__outer">
        <div className="progress__inner" style={{width: '30%'}}>

        </div>
      </div>
    </div>
  );
}
