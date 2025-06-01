import React, { useEffect, useState } from 'react';
import '../css/home.css';
import '../css/select.css';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateDatasetRef } from '../../redux/slices/appSlice';

export default function SelectDataset() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState<string>('');
  const [final, setFinal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [exists, setExists] = useState<Array<boolean>>([]);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'fetch_datasets',
        args: [query],
        module: 'dataset_fetcher',
      });
      setResults(res);
      setFinal(query);
      setLoading(false);
      setExists(Array(res?.length).fill(false));
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const downloadDataset = async (item: any, ref: string) => {
    setDownloadStarted(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'download_dataset',
        args: [item, ref],
        module: 'dataset_fetcher',
      });
      console.log(res);
      setDownloadStarted(false);
    } catch (err) {
      console.log(err);
      setDownloadStarted(false);
    }
  };

  const datasetExists = async (folderName: string, index: number) => {
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'fileExists',
        args: [folderName],
        module: 'helpers',
      });
      console.log(res);

      setExists((prev) => {
        const updated = [...prev];
        updated[index] = res;
        return updated;
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    results?.map((item: any, index: number) => {
      datasetExists(item?.ref?.replace('/', '_'), index);
    });
  }, [downloadStarted, results]);

  useEffect(() => {
    handleClick();
  }, []);

  console.log(exists);

  return (
    <div className="select__container">
      {loading && <Loader />}
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Select</span>
        </span>
        <input
          type="text"
          className="navbar__search"
          placeholder="Type here"
          value={query}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              handleClick();
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      <div className="select__main">
        <span className="sm__header">
          {final === '' ? 'Select a Dataset' : 'Search results for ' + final}
        </span>
        <div className="all__datasets">
          {results?.map((item: any, index: number) => {
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
                      if (exists[index] === false) {
                        downloadDataset(item, item?.ref);
                      } else {
                        dispatch(updateDatasetRef(item?.ref?.replace('/', '_')))
                        navigate('/dataset-viewer')
                        // getAllDatasets(item?.ref?.replace('/', '_'));
                      }
                    }}
                  >
                    {exists[index] === true ? 'VIEW' : 'DOWNLOAD'}
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
