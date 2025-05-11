import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../css/trainer.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function MainTrainer() {
  const task = useSelector((state: any) => state.app.task);
  const [arch, setArch] = useState([]);
  const [hyperparameters, setHyperparamters] = useState<object>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log(task);

  const getInfo = async () => {
    setLoading(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'get_info',
        args: [task],
        module: 'xander',
      });
      console.log(res);
      setArch(res?.architecture);
      setHyperparamters(res?.hyperparameters);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getInfo();
  }, [task]);

  const figureOutArch = (arch: any) => {
    const obj: any = {};
    arch.map((item: any) => {
      if (obj[item.layer]) {
        obj[item.layer] = obj[item.layer] + 1;
      } else {
        obj[item.layer] = 1;
      }
    });
    let string = 'Using ';
    for (const key in obj) {
      string += `${obj[key]} ${key} layers, `;
    }
    return string.slice(0, string.length - 2);
  };

  return (
    <div className="trainer__container">
      {loading && <Loader />}
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Train</span>
        </span>
      </div>
      <div className="tc__header">{task}</div>
      <div className="progress__outer">
        <div className="progress__inner" style={{ width: '30%' }}></div>
      </div>
      <div className="boxes">
        <div className="box">
          <span className="box__header">TYPE</span>
          <span className="box__content">Deep Learning</span>
        </div>
        <div className="box">
          <span className="box__header">{'Architecture'.toUpperCase()}</span>
          <span className="box__content">
            {/* Artificial Neural Network {'(Dense layers)'} */}
            {figureOutArch(arch)}
          </span>
        </div>
      </div>
      <div className="hyperparameters">
        <span className="hp__header">Hyperparameters</span>
        <div className="all__params">
          {Object.keys(hyperparameters)?.map((key: string, index: number) => {
            return (
              <div className="current__param">
                <span className="cp__header">{key}</span>
                <input
                  type="text"
                  className="cp__value"
                  value={hyperparameters[key] || 0}
                  onChange={(e) => {
                    if (key === 'validation_size') {
                      if (parseFloat(e.target.value) <= 0.4) {
                        let arr = { ...hyperparameters };
                        arr[key] = parseFloat(e.target.value);
                        setHyperparamters(arr);
                      } else {
                        // toast("Validation size can't be greater than 0.4", {
                        //   position: 'top-right',
                        //   autoClose: 4000,
                        //   hideProgressBar: false,
                        //   closeOnClick: true,
                        //   pauseOnHover: true,
                        //   draggable: true,
                        //   progress: undefined,
                        //   theme: 'dark',
                        // });
                        alert("Validation size can't be greater than 0.4")
                      }
                    } else {
                      let arr = { ...hyperparameters };
                      arr[key] = parseInt(e.target.value);
                      setHyperparamters(arr);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="start__training">
        <div className="st__btn">{'Start Training'.toUpperCase()}</div>
      </div>
    </div>
  );
}
