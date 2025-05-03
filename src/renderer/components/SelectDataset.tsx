import React, { useEffect, useState } from 'react';
import '../css/home.css';
import '../css/select.css';

export default function SelectDataset() {
  const [result, setResults] = useState([])

  const handleClick = async () => {
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'fetch_datasets',
        args: [''],
        module: 'dataset_fetcher'
      });
      console.log(res)
      setResults(res)
    } catch (err) {
        console.log(err)
    }
  };

  useEffect(() => {
    handleClick()
  }, [])

  return (
    <div className="select__container">
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Select</span>
        </span>
        <input type="text" className="navbar__search" placeholder="Type here" />
      </div>
      <div className="select__main">
        <span className="sm__header">Select a Dataset</span>
      </div>
    </div>
  );
}
