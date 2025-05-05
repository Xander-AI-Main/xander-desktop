// import React, { useState } from 'react'
// import styles from '../css/sidebar.css'
// import profile from '../assets/profile.svg'
// import info from '../assets/info.svg'
// import home from '../assets/home.png'
// import model from '../assets/model.svg'
// import dataset from '../assets/dataset.svg'
// import menu from '../assets/menu.svg'
// import { useNavigate } from 'react-router-dom'
// import pencil from '../assets/pencil.png'

// export default function Sidebar({data, changeCollapsed, prevCollpased}: {data: any, changeCollapsed: any, prevCollpased: boolean}) {
//     const [collapsed, setCollpased] = useState(false)
//     const navigate = useNavigate()
//     return (
//       <div className={styles.sidebar} style={{ width: collapsed ? "18rem" : "4rem" }}>
//         <div className={styles.main__menu}>
//           <div className={styles.menu} style={{ right: collapsed ? "2.3rem" : "0" }} onClick={() => {
//             setCollpased(!collapsed)
//             changeCollapsed(!prevCollpased)
//           }} >
//             <img src={menu} alt="menu" />
//           </div>
//           {collapsed && <span onClick={() => {
//             navigate('/main')
//             window.location.reload()
//           }}>Xander</span>}
//         </div>
//         <div className={styles.options}>
//           <div className={styles.above__options}>
//             <div className={styles.option} onClick={() => {
//               if (window.location.href.includes("main")) {
//                 window.location.reload()
//               }
//               navigate('/main')
//             }}>
//               <img src={home} style={{width: '27px'}} alt="profile" />
//               {collapsed && <span>Home</span>}
//             </div>
//             <div className={styles.option} onClick={() => {
//               navigate('/profile')
//             }}>
//               <img src={profile} alt="profile" />
//               {collapsed && <span>My Profile</span>}
//             </div>
//             <div className={styles.option} onClick={() => {
//               navigate('/models')
//             }}>
//               <img src={model} alt="model" />
//               {collapsed && <span>Saved Models</span>}
//             </div>
//             <div className={styles.option} onClick={() => {
//               navigate('/datasets')
//             }}>
//               <img src={dataset} alt="dataset" />
//               {collapsed && <span>Saved Datasets</span>}
//             </div>
//           </div>
//           {collapsed ? <div className={styles.below__options}>
//             <div className={styles.plan__details}>
//               <span>{data.plan && `${data.plan.charAt(0).toUpperCase()}${data.plan.slice(1)}`} Plan</span>
//               <img src={pencil} alt="" onClick={() => {
//                 navigate('/pricing')
//               }}/>
//             </div>
//             <span>{data.s3_storage_used && data.s3_storage_used.toFixed(2)} / {data.max_storage_allowed ? data.max_storage_allowed : 0} GB Used</span>
//             <span>{(data.plan === "free" || data.plan === "individual" || data.plan === "researcher" || data.plan === "basic") ? (data.cpu_hours_used && data.cpu_hours_used.toFixed(2)) : (data.gpu_hours_used && data.gpu_hours_used.toFixed(2))} / {data.max_gpu_hours_allowed > 0 ? data.max_gpu_hours_allowed : data.max_cpu_hours_allowed} Hours Used</span>
//           </div>
//             :
//             <div className={styles.i__option} onClick={() => {
//               setCollpased(!collapsed)
//               changeCollapsed(!prevCollpased)
//             }}>
//               <img src={info} alt="" />
//             </div>
//           }
//         </div>
//       </div>
//     )
// }

import React, { useState } from 'react';
import '../css/sidebar.css';
import profile from '../assets/profile.svg';
import info from '../assets/info.svg';
import dashboard from '../assets/layout(1).png';
import training from '../assets/dimensions(1).png';
import choice from '../assets/choice(1).png';
import add from '../assets/add(1).png';
import ai from '../assets/ai(1).png';
import home from '../assets/home.png';
import model from '../assets/model.svg';
import dataset from '../assets/bookmark.png';
import menu from '../assets/menu.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import pencil from '../assets/pencil.png';

export default function Sidebar({
  data,
  changeCollapsed,
  prevCollpased,
}: {
  data: any;
  changeCollapsed: any;
  prevCollpased: boolean;
}) {
  const [collapsed, setCollpased] = useState(true);
  const navigate = useNavigate();
  const location = useLocation()

  console.log(location.pathname)
  return (
    <div className="sidebar" style={{ width: collapsed ? '22rem' : '5rem' }}>
      <div className="main__menu">
        <div
          className="menu"
          style={{ right: collapsed ? '1.8rem' : '0' }}
          onClick={() => {
            setCollpased(!collapsed);
            changeCollapsed(!prevCollpased);
          }}
        >
          <img src={menu} alt="menu" />
        </div>
        {collapsed && (
          <span
            onClick={() => {
              navigate('/dashboard');
              window.location.reload();
            }}
          >
            Nexus Lab
          </span>
        )}
      </div>
      <div className="options"
          style={{ marginLeft: collapsed ? '2rem' : '0.5rem' }}
      >
        <div className="above__options">
          <div
            className={location.pathname.includes('dashboard') ? 'option' : 'inactive__option'}
            onClick={() => {
              if (window.location.href.includes('dashboard')) {
                window.location.reload();
              }
              navigate('/dashboard');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={dashboard} style={{ width: '27px' }} alt="profile" />
            {collapsed && <span>Dashboard</span>}
          </div>
          <div
            className={location.pathname.includes('train') ? 'option' : 'inactive__option'}
            onClick={() => {
              if (window.location.href.includes('main')) {
                window.location.reload();
              }
              navigate('/train');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={training} style={{ width: '27px' }} alt="profile" />
            {collapsed && <span>Train Model</span>}
          </div>
          <div
            className={location.pathname.includes('select') ? 'option' : 'inactive__option'}
            onClick={() => {
              navigate('/select');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={choice} style={{width: '27px'}} alt="profile" />
            {collapsed && <span>Download Dataset</span>}
          </div>
          <div
            className={location.pathname.includes('create') ? 'option' : 'inactive__option'}
            onClick={() => {
              navigate('/create');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={add} style={{width: '27px'}} alt="model" />
            {collapsed && <span>Create Dataset</span>}
          </div>
          <div
            className={location.pathname.includes('saved-models') ? 'option' : 'inactive__option'}
            onClick={() => {
              navigate('/saved-models');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={dataset} alt="dataset" />
            {collapsed && <span>Saved Models</span>}
          </div>
          <div
            className={location.pathname.includes('saved-datasets') ? 'option' : 'inactive__option'}
            onClick={() => {
              navigate('/saved-datasets');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={dataset} alt="dataset" />
            {collapsed && <span>Saved Datasets</span>}
          </div>
          <div
            className={location.pathname.includes('dataset-viewer') ? 'option' : 'inactive__option'}
            onClick={() => {
              navigate('/dataset-viewer');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={dataset} alt="dataset" />
            {collapsed && <span>Dataset Viewer</span>}
          </div>
          <div
            className={location.pathname.includes('llm') ? 'option' : 'inactive__option'}
            onClick={() => {
              navigate('/llm');
            }}
            style={{width: !collapsed ? '36%' : '95%'}}
          >
            <img src={ai} style={{width: '30px', height: '30px'}} alt="dataset" />
            {collapsed && <span>LLM Playground</span>}
          </div>
        </div>
        {/* {collapsed ? (
          <div className="below__options">
            <div className="plan__details">
              <span>
                {data.plan &&
                  `${data.plan.charAt(0).toUpperCase()}${data.plan.slice(1)}`}{' '}
                Plan
              </span>
              <img
                src={pencil}
                alt=""
                onClick={() => {
                  navigate('/pricing');
                }}
              />
            </div>
            <span>
              {data.s3_storage_used && data.s3_storage_used.toFixed(2)} /{' '}
              {data.max_storage_allowed ? data.max_storage_allowed : 0} GB Used
            </span>
            <span>
              {data.plan === 'free' ||
              data.plan === 'individual' ||
              data.plan === 'researcher' ||
              data.plan === 'basic'
                ? data.cpu_hours_used && data.cpu_hours_used.toFixed(2)
                : data.gpu_hours_used && data.gpu_hours_used.toFixed(2)}{' '}
              /{' '}
              {data.max_gpu_hours_allowed > 0
                ? data.max_gpu_hours_allowed
                : data.max_cpu_hours_allowed}{' '}
              Hours Used
            </span>
          </div>
        ) : (
          <div
            className="i__option"
            onClick={() => {
              setCollpased(!collapsed);
              changeCollapsed(!prevCollpased);
            }}
          >
            <img src={info} alt="" />
          </div>
        )} */}
      </div>
    </div>
  );
}
