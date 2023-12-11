import React from "react";
import tabClose from '../assets/tab-close.png'

const Tab = (props) => {
    let tabClassName
    if (props.status === 'active'){
        tabClassName = 'tab-item tab-item-active'
    } else {
        tabClassName = 'tab-item'
    }

    return (
        <div className={tabClassName} onMouseDown = {()=>{props.onMouseDown(props.id)}} onClick = {()=>{props.onClick(props.id)}}>
            <img src={props.favicon} className='tab-fav'></img>
            <div className='color-foreground-neutral-1 font-caption-1' style={{ width: '100%' }}>{props.name}</div>
            <img src={tabClose} className='tab-close'></img>
        </div>
    )
}

export default Tab