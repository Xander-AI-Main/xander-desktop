import React, { useState } from 'react';
import '../css/home.css';
import styles from '../css/a.module.css';
import training from '../assets/dimensions(1).png';
import ai from '../assets/ai(1).png';
import dataset from '../assets/bookmark.png';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';

export default function Home() {
  const [data, setData] = useState<Array<object>>([
    {
      x: 'Model 1',
      y: 90,
    },
    {
      x: 'Model 2',
      y: 35,
    },
    {
      x: 'Model 3',
      y: 64,
    },
    {
      x: 'Model 4',
      y: 56,
    },
    {
      x: 'Model 6',
      y: 83,
    },
    {
      x: 'Model 7',
      y: 32,
    },
    {
      x: 'Model 8',
      y: 46,
    },
    {
      x: 'Model 9',
      y: 38,
    },
    {
      x: 'Model 10',
      y: 99,
    },
    {
      x: 'Model 11',
      y: 73,
    },
    {
      x: 'Model 12',
      y: 29,
    },
    {
      x: 'Model 13',
      y: 90,
    },
  ]);

  const BarGraph = ({ data }: { data: any }) => {
    return (
      <div className="bar__container">
        <div className="bc__inner">
          {data?.map((item: any) => {
            return (
              <div className="column">
                <span className="y__label">{item.y} %</span>
                <div className="actual" style={{ height: item.y + '%' }}></div>
                <span className="x__label">{item.x}</span>
              </div>
            );
          })}
        </div>
        {/* <div className="x__tickers">
          {data?.map((item: any) => {
            return <span className="x__label">{item.x}</span>;
          })}
        </div> */}
      </div>
    );
  };

  return (
    <div className="home__container">
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Dashboard</span>
        </span>
        <input type="text" className="navbar__search" placeholder="Type here" />
      </div>
      <div className="d__cards">
        <div className="current__d__card">
          <div className="dc__left">
            <span className="dcl__first">Models Trained</span>
            <span className="dcl__second">10</span>
          </div>
          <div className="dc__right">
            <img src={training} alt="" />
          </div>
        </div>
        <div className="current__d__card">
          <div className="dc__left">
            <span className="dcl__first">LLMs Downloaded</span>
            <span className="dcl__second">10</span>
          </div>
          <div className="dc__right">
            <img src={ai} alt="" style={{ height: '28px' }} />
          </div>
        </div>
        <div className="current__d__card">
          <div className="dc__left">
            <span className="dcl__first">Datasets Created</span>
            <span className="dcl__second">10</span>
          </div>
          <div className="dc__right">
            <img src={dataset} alt="" />
          </div>
        </div>
      </div>
      <div className="model__accuracy__analysis">
        <span className="maa__header">Previous Models Accuracy</span>
        <BarGraph data={data} />
      </div>
    </div>
  );
}
