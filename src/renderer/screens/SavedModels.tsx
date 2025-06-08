import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../css/sd.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { updateDatasetRef, updateModel } from '../../redux/slices/appSlice';

export default function SavedModels() {
  const [data, setData] = useState<any>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getAllDatasets = async () => {
    setLoading(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'return_all_models',
        args: [],
        module: 'helpers',
      });
      console.log(res);
      setData(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllDatasets();
  }, []);

  return (
    <div className="sd__container">
      {loading && <Loader />}
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Saved Models</span>
        </span>
        <input
          type="text"
          className="navbar__search"
          placeholder="Type here"
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
            }
          }}
          onChange={(e) => {}}
        />
      </div>
      <div className="select__main">
        <span className="sm__header">Select a Model</span>
        <div className="all__datasets">
          {data?.map((item: any, index: number) => {
            return (
              <div className="current__dataset">
                <div className="cd__top">
                  <span className="sm__title">{item?.name}</span>
                  <span className="sm__subtitle">{item?.task}</span>
                </div>
                {item?.task === 'Regression' && (
                  <div className="sm__middle">
                    <span className="sm__size">
                      <b>Epochs:</b> {item?.last_epoch?.epoch}
                    </span>
                    <span className="sm__size">
                      <b>Train Loss:</b> {item?.last_epoch?.train_loss?.toFixed(2)}
                    </span>
                    <span className="sm__size">
                      <b>Test Loss:</b> {item?.last_epoch?.test_loss?.toFixed(2)}
                    </span>
                  </div>
                )}
                {item?.task === 'Classification' && (
                  <div className="sm__middle">
                    <span className="sm__size">
                      <b>Epochs:</b> {item?.last_epoch?.epoch}
                    </span>
                    <span className="sm__size">
                      <b>Train Loss:</b> {item?.last_epoch?.train_loss?.toFixed(2)}
                    </span>
                    <span className="sm__size">
                      <b>Test Loss:</b> {item?.last_epoch?.test_loss?.toFixed(2)}
                    </span>
                    <span className="sm__size">
                      <b>Train Accuracy:</b> {(parseFloat(item?.last_epoch?.train_acc) * 100).toFixed(2)}%
                    </span>
                    <span className="sm__size">
                      <b>Test Accuracy:</b> {(parseFloat(item?.last_epoch?.test_acc) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
                <div className="cd__bottom">
                  <span
                    className="sm__download"
                    onClick={() => {
                        dispatch(updateModel(item?.name));
                        navigate('/model-playground');
                    }}
                  >
                    TEST MODEL
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
