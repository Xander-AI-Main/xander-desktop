import React, { useRef } from 'react';
import '../css/loader.css'

const Loader = () => {
  const opacityRef = useRef(null);

  return (
    <div className="modal-open modal" ref={opacityRef}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
