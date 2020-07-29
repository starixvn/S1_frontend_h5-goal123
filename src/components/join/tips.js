import React from 'react';

export default  (props)=>(
    <>
        <i className={`icon ${props.Icon}`}></i>
        <div className={`${props.ClassName} ${props.IsOpen ? "open" : ""}`}>
            {props.children}
        </div>
    </>
)