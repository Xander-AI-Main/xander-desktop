import React from 'react';
import '../css/home.css';
import '../css/select.css';

export default function SelectDataset() {
  return (
    <div className="select__container">
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Select</span>
        </span>
        <input type="text" className="navbar__search" placeholder="Type here" />
      </div>
      <div className="select__main">
        <span className="sm__header">
            Select a Dataset
        </span>
      </div>
    </div>
  );
}
