import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../css/sd.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { updateDatasetRef } from '../../redux/slices/appSlice';

export default function SavedDatasets() {
  const [data, setData] = useState<any>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getAllDatasets = async () => {
    setLoading(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'returnSavedDatasets',
        args: [],
        module: 'dataset_fetcher',
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
          Screens <span className="inner"> / Saved Datasets</span>
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
        <span className="sm__header">Select a Dataset</span>
        <div className="all__datasets">
          {data?.map((item: any, index: number) => {
            return (
              <div className="current__dataset">
                <div className="cd__top">
                  <span className="cd__title">{item?.title}</span>
                  <span className="cd__subtitle">{item?.subtitle}</span>
                </div>
                <div className="cd__bottom">
                  <span className="cd__size">
                    {item?.size_mb?.toFixed(2)} MB
                  </span>
                  <span
                    className="cd__download"
                    onClick={() => {
                      dispatch(updateDatasetRef(item?.ref?.replace('/', '_')));
                      navigate('/dataset-viewer');
                    }}
                  >
                    VIEW
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
