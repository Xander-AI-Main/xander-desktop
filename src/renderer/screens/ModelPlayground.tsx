import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../css/mp.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function ModelPlayground() {
  const modelName = useSelector((state: any) => state.app.modelName);
  const [rowData, setRowData] = useState<Array<any>>([]);
  const [index, setIndex] = useState<number>(0);
  const [data, setData] = useState<any>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getModelInfo = async (model: string) => {
    setLoading(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'return_model',
        args: [model],
        module: 'model_functions',
      });
      console.log(res);
      setData(res?.data);
      setRowData(res?.data?.row);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const predict = async () => {
    setLoading(true);
    try {
      const payload = {
        function: 'predict',
        args: [modelName, rowData],
        module: 'model_functions',
      };
      const res = await window.electronAPI.trainPythonFunc(payload);
      console.log(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

    useEffect(() => {
      window.electronAPI.onTrainLog((log: any) => {
        console.log(typeof log);
        console.log(log);
        if (typeof log === 'string') {
        //   setInfo((info) => [...info, log]);
        console.log(log)
          if (document.getElementById('scroll') !== null) {
            document.getElementById('scroll').scrollBy({
              top: document.getElementById('scroll').scrollTop + 30,
            });
          }
          // console.log('[TRAIN]', log);
          if (typeof log === 'string' && log.includes('Done')) {
            // setFinished(true);
            // setTraining(false);
          }
        }
      });
  
      return () => {
        window.electronAPI.removeTrainLogListener();
      };
    }, []);

  useEffect(() => {
    getModelInfo(modelName);
  }, [modelName]);

  return (
    <div className="mp__container">
      {loading && <Loader />}
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Model Playground</span>
        </span>
      </div>
      <div className="next__bar">
        <span className="dataset__name">{modelName}</span>
        <div>
          <span
            className="select__dataset"
            onClick={() => {
              navigate('/saved-models');
            }}
          >
            Choose Another
          </span>
          <span
            className="select__dataset"
            onClick={() => {
              // navigate('/saved-models');\
              predict();
            }}
          >
            Predict
          </span>
        </div>
      </div>
      <div className="mp__main">
        <span className="mp__header">
          <b>Model Type:</b> {data?.task}
        </span>
        <div className="example__input">
          <span className="ei__header">Example Input</span>
          {data?.task === 'Regression' && (
            <div className="data__points" id="scroll">
              {data?.columns?.map((item: any, index: number) => {
                return (
                  <div className="current__data__point">
                    <span>{item}</span>
                    <input
                      type="text"
                      value={rowData[index]}
                      onChange={(e) => {
                        let rd = [...rowData];
                        rd[index] = e.target.value;
                        setRowData(rd);
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        let rd = [...rowData];

                        if (value === '' || isNaN(parseFloat(value))) {
                          rd[index] = 0;
                        } else {
                          rd[index] = parseFloat(value);
                        }

                        setRowData(rd);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
