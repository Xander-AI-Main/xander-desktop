// import React, { useState } from 'react';
// import styles from "../layout.css";
// import Sidebar from './Sidebar';

// export default function Layout({ children, data }: {children: any, data: any}) {
//   const [collapsed, setCollapsed] = useState(false);

//   const changeCollapsed = (data: boolean) => {
//     setCollapsed(data);
//   };

//   return (
//     <div className={styles.container}>
//       <Sidebar data={data} changeCollapsed={changeCollapsed} prevCollpased={collapsed} />
//       <div className={styles.background__style}></div>
//       <div className={styles.content} style={{ width: collapsed ? "83%" : "95%" }}>
//         {React.Children.map(children, child =>
//           React.cloneElement(child, { collapsed })
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import "../css/layout.css";
import Sidebar from './Sidebar';

export default function Layout({ children, data }: {children: any, data: any}) {
  const [collapsed, setCollapsed] = useState(true);

  const changeCollapsed = (data: boolean) => {
    setCollapsed(data);
  };

  return (
    <div className="layout__container">
      <Sidebar data={data} changeCollapsed={changeCollapsed} prevCollpased={collapsed} />
      {/* <div className="background__style"></div> */}
      <div className="content" style={{ width: collapsed ? "77%" : "93%" }}>
        {React.Children.map(children, child =>
          React.cloneElement(child, { collapsed })
        )}
      </div>
    </div>
  );
}
