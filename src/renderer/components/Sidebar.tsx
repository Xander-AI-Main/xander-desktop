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
import home from '../assets/home.png';
import model from '../assets/model.svg';
import dataset from '../assets/dataset.svg';
import menu from '../assets/menu.svg';
import { useNavigate } from 'react-router-dom';
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
  const [collapsed, setCollpased] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="sidebar" style={{ width: collapsed ? '21rem' : '5rem' }}>
      <div className="main__menu">
        <div
          className="menu"
          style={{ right: collapsed ? '2.3rem' : '0' }}
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
              navigate('/main');
              window.location.reload();
            }}
          >
            Tensor Labs
          </span>
        )}
      </div>
      <div className="options"
          style={{ marginLeft: collapsed ? '3.1rem' : '1.7rem' }}
      >
        <div className="above__options">
          <div
            className="option"
            onClick={() => {
              if (window.location.href.includes('main')) {
                window.location.reload();
              }
              navigate('/main');
            }}
          >
            <img src={home} style={{ width: '27px' }} alt="profile" />
            {collapsed && <span>Home</span>}
          </div>
          <div
            className="option"
            onClick={() => {
              navigate('/profile');
            }}
          >
            <img src={profile} alt="profile" />
            {collapsed && <span>My Profile</span>}
          </div>
          <div
            className="option"
            onClick={() => {
              navigate('/models');
            }}
          >
            <img src={model} alt="model" />
            {collapsed && <span>Saved Models</span>}
          </div>
          <div
            className="option"
            onClick={() => {
              navigate('/datasets');
            }}
          >
            <img src={dataset} alt="dataset" />
            {collapsed && <span>Saved Datasets</span>}
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
