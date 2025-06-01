import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../css/viewer.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function DatasetViewer() {
  const datasetRef = useSelector((state: any) => state.app.datasetRef);
  const [index, setIndex] = useState<number>(0);
  const [data, setData] = useState<any>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getAllDatasets = async (folderName: string) => {
    setLoading(true);
    try {
      const res = await window.electronAPI.callPythonFunc({
        function: 'return_all_datasets',
        args: [folderName],
        module: 'dataset_fetcher',
      });
      console.log(res);
      console.log(res?.data[Object.keys(res?.data)[index]]);
      setData(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllDatasets(datasetRef);
  }, [datasetRef]);
  // console.log(data?.data[Object.keys(data?.data)[index]])
  // console.log(Object.values(data[Object.keys(data)[index]]));

  return (
    <div className="dv__container">
      {loading && <Loader />}
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Viewer</span>
        </span>
      </div>
      <div className="next__bar">
        <span className="dataset__name">{datasetRef?.replace('_', '/')}</span>
        <div className="nb__options">
          <span
            className="select__dataset"
            onClick={() => {
              // navigate('/saved-datasets');
            }}
          >
            Collapse Text
          </span>
          <span
            className="select__dataset"
            onClick={() => {
              // navigate('/saved-datasets');
            }}
          >
            Train Model
          </span>
          {/* <span className="download__dataset" onClick={() => {}}>
            Combine Datasets
          </span> */}
        </div>
      </div>
      <div className="dv__main">
        {/* table */}
        <div className="dvm__right">
          {data?.data && (
            <span className="dr__header">
              Showing 100 / {data?.data[Object.keys(data?.data)[index]]?.length}{' '}
              rows
            </span>
          )}
          <div className="table-scroll-wrapper">
            {data &&
              data?.columns &&
              data?.data &&
              data?.data[Object.keys(data?.data)[index]] &&
              data?.data[Object.keys(data?.data)[index]]?.length > 0 && (
                <table>
                  <thead className="dvm__thead">
                    <tr>
                      <th
                        style={{
                          borderTopLeftRadius: '8px',
                          borderBottomLeftRadius: '8px',
                        }}
                      >
                        S. No
                      </th>
                      {Object.keys(
                        data?.data[Object.keys(data?.data)[index]][0],
                      )?.map((item: any, index: number) => {
                        return <th key={index}>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody className="dvm__tbody">
                    {data?.data[Object.keys(data?.data)[index]]
                      ?.slice(0, 100)
                      ?.map((item: any, index: number) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            {Object.keys(item)?.map(
                              (elem: any, curr: number) => {
                                return <td>{item[elem]}</td>;
                              },
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
          </div>
        </div>
        {/* other datasets */}
        <div className="dvm__left">
          <span className="dl__header">Dataset Explorer</span>
          {data?.data && (
            <div className="dl__datasets">
              {Object.keys(data?.data)?.map((item: any, curr: number) => {
                return (
                  <div
                    className={
                      curr === index
                        ? 'dl__current__active'
                        : 'dl__current__inactive'
                    }
                    onClick={() => {
                      setIndex(curr);
                    }}
                  >
                    {item}
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
