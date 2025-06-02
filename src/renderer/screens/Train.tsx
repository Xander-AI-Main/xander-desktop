import React, { useState } from 'react';
import '../css/train.css';
import '../css/home.css';
import upload from '../assets/Upload.svg';
import regression from '../assets/regression-analysis.png';
import classification from '../assets/classification.png';
import textual from '../assets/documents.png';
import finetune from '../assets/gear.png';
import ic from '../assets/ic.png';
import anomaly from '../assets/anomaly.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateFile, updateTask } from '../../redux/slices/appSlice';

export default function Train() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [task, setTask] = useState('');
  
  async function uploadFile(e: any) {
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
  
    const savedPath = await window.electronAPI.saveFileBuffer({
      name: file.name,
      buffer: Array.from(new Uint8Array(buffer)),
    });
  
    dispatch(updateFile(savedPath));
    navigate('/main-trainer');
  }

  const services = [
    {
      name: 'Regression',
      info: 'This includes price prediction, sales forecasting, demand estimation, medical outcome prediction, and environmental impact assessment etc.',
      action: 'Upload CSV',
      allow: '.csv',
      image: regression,
    },
    {
      name: 'Classification',
      info: 'It is implemented for email categorization, fraud detection, medical diagnosis, segmentation, and image recognition and much more.',
      action: 'Upload CSV',
      allow: '.csv',
      image: classification,
    },
    {
      name: 'Textual',
      info: 'We offer sentiment analysis, topic classification, and spam detection for customer feedback analysis, comment moderation etc.',
      action: 'Upload CSV',
      allow: '.csv',
      image: textual,
    },
    {
      name: 'Finetuning LLMs',
      info: 'Covers services like customer service automation, virtual personal assistants, healthcare triage, e-learning support, and e-commerce solutions etc.',
      action: 'Upload JSON/CSV',
      allow: '.json,.csv',
      image: finetune,
    },
    {
      name: 'Image Labelling',
      info: 'Application lies in healthcare for disease detection, agriculture for crop monitoring, retail for inventory management, security for surveillance etc.',
      action: 'Upload ZIP',
      allow: '.zip',
      image: ic,
    },
    {
      name: 'Anomaly Detection',
      info: 'Applications include network security, manufacturing quality control, predictive maintenance, credit scoring etc.',
      action: 'Upload CSV',
      allow: '.csv',
      image: anomaly,
    },
  ];

  return (
    <div className="train__container">
      <div className="navbar">
        <span className="outer">
          Screens <span className="inner"> / Train</span>
        </span>
        <input type="text" className="navbar__search" placeholder="Type here" />
      </div>
      <div className="tc__main">
        <span className="tcm__header">Choose a Type</span>
        <div className="all__services">
          {services?.map((item, index) => {
            return (
              <div
                className="mainService"
                key={index}
                onClick={() => {
                  dispatch(updateTask(item.name));
                }}
              >
                <img src={item?.image} alt="" className="ms__img" />
                <span className="service__header">{item.name}</span>
                <div className="sub__serv">
                  <span className="service__info">{item.info}</span>
                  <label className="uploadLabel">
                    <div className="choose">
                      <div className="upload__icon">
                        <img src={upload} alt="" />
                      </div>
                      <span className="info">{item.action}</span>
                      <input
                        type="file"
                        className="hiddenInput"
                        accept={item.allow}
                        onChange={(e) => {
                          dispatch(updateTask(item.name));
                          uploadFile(e);
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
