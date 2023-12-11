import { useState, useEffect } from 'react';
import Tab from './components/Tab'

import './App.css';
import closeImage from './assets/close.png'
import profileImage from './assets/profile.png'
import toolLeftImage from './assets/tool-left.png'
import toolRightImage from './assets/tool-right.png'
import favoritesImage from './assets/favorites.png'
import lockImage from './assets/lock.png'
import favGoogle from './assets/google.png'
import favYoutube from './assets/youtube.png'
import favExpedia from './assets/expedia.png'
import favAmazon from './assets/amazon.png'
import contentGoogle from './assets/contentgoogle.png'
import contentAmazon from './assets/contentamazon.png'
import contentExpedia from './assets/contentexpedia.png'
import contentYoutube from './assets/contentyoutube.png'
import iconSplitHint from './assets/split-hint.png'
import iconSplitHintActive from './assets/split-hint-active.png'

const TabData = [{ name: 'Google', icon: favGoogle, content: contentGoogle }, { name: 'Expedia', icon: favExpedia, content: contentExpedia }, { name: 'Amazon', icon: favAmazon, content: contentAmazon }, { name: 'Youtube', icon: favYoutube, content: contentYoutube }]
let tabListInit = []
for (let i = 0; i < 4; i++) {
  tabListInit.push(TabData[Math.floor(4 * Math.random())])
}
const initPosition = 10000
////////// between 0-720 //////////
const pivotPoint = 180

function App() {
  const [designDirection, setDesignDirection] = useState('container')
  const [tabList, setTabList] = useState(tabListInit)
  const [dragStatus, setDragStatus] = useState('default')
  const [cursorPosition, setCursorPositionHandler] = useState({ x: initPosition, y: initPosition })
  const [activeTab, setActiveTab] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)
  const [overlayDirection, setOverLayDirection] = useState('right')

  useEffect(() => {
    if (dragStatus === 'drag-thumbnail-init') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
  }, [dragStatus])

  const selectOptionHandler = (event) => {
    setDesignDirection(event.target.value)
  }

  const initHandler = () => {
    setTabList(tabListInit)
    setDragStatus('defualt')
    setCursorPositionHandler({ x: initPosition, y: initPosition })
    setActiveTab(0)
    setSelectedTab(0)
    setOverLayDirection('right')
  }

  ////////// overlay handler //////////
  const overlayMouseEnterHandler = () => {
    if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
      setDragStatus('drag-thumbnail-in')
    }
  }

  const overlayMouseLeaveHandler = () => {
    if (dragStatus === 'drag-thumbnail-in') {
      setDragStatus('drag-thumbnail')
      console.log('overlay leave missfired')
    }
  }

  ////////// tab handler //////////
  const tabMouseDownHandler = (select) => {
    setSelectedTab(select)
    setDragStatus('drag-init')
    setCursorPositionHandler({ x: initPosition, y: initPosition })
  }

  const tabMouseEnterHandler = () => {
    if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
      setDragStatus('drag-thumbnail-tabin')
    }
  }

  const tabMouseLeaveHandler = () => {
    if (dragStatus === 'drag-init') {
      setDragStatus('drag-thumbnail-init')
    } else if (dragStatus === 'drag-thumbnail-tabin') {
      setDragStatus('drag-thumbnail')
    }
  }

  const clickTabHandler = (i) => {
    setActiveTab(i)
  }

  const removeTabHandler = (i) => {
    const tempTabList = [...tabList]
    tempTabList.splice(i, 1)
    setTabList(tempTabList)
  }
  ////////// mousemove handler //////////
  const handleMouseMove = (event) => {
    setCursorPositionHandler({ x: event.x, y: event.y })
    // console.log(event.x)
  }

  const handleMouseUp = (event) => {
    // console.log('mouse move removed')
    window.removeEventListener('mousemove', handleMouseMove)
    // setCursorPositionHandler({ x: -1000, y: -1000 })
  }

  ////////// mouseup handler //////////
  const splitTriggerHandler = (event) => {
    if (dragStatus === 'drag-thumbnail-in') {
      setDragStatus('end-split')
      removeTabHandler(selectedTab)
    } else if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
      setDragStatus('end-window')
      removeTabHandler(selectedTab)
    } else if (dragStatus === 'drag-thumbnail-tabin') {
      setDragStatus('default')
    } else {
      initHandler()
    }
  }

  let tabs = []
  for (let i = 0; i < tabList.length; i++) {
    let tabStatus
    if (i === activeTab) {
      tabStatus = 'active'
    } else {
      tabStatus = 'default'
    }
    tabs.push(<Tab name={tabList[i].name} favicon={tabList[i].icon} status={tabStatus} onMouseDown={tabMouseDownHandler} id={i} onClick={clickTabHandler} key={i}></Tab>)
  }

  let thumbnail
  if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init' || dragStatus === 'drag-thumbnail-in') {
    thumbnail = (
      <div className='thumbnail' style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}>
        <img src={tabList[selectedTab].content} style={{ width: '240px' }}></img>
      </div>
    )
  } else {
    thumbnail = <div></div>
  }

  ////////// overlay direction //////////
  let overlayStyleRight, overlayStyleLeft, container, appWindow
  if (designDirection === 'overlay') {
    if (overlayDirection === 'right' && (window.innerWidth / 2 - pivotPoint) > cursorPosition.x) {
      setOverLayDirection('left')
    } else if (overlayDirection === 'left' && (window.innerWidth / 2 + pivotPoint) < cursorPosition.x) {
      setOverLayDirection('right')
    }
    if (overlayDirection === 'right') {
      if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
        overlayStyleRight = { width: '360px' }
      } else if (dragStatus === 'drag-thumbnail-in') {
        overlayStyleRight = { width: '716px' }
      } else if (dragStatus === 'drag-thumbnail-tabin' || dragStatus === 'end-split' || dragStatus === 'end-window') {
        overlayStyleRight = { width: '0px' }
      }
    } else if (overlayDirection === 'left') {
      if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
        overlayStyleLeft = { width: '360px' }
      } else if (dragStatus === 'drag-thumbnail-in') {
        overlayStyleLeft = { width: '716px' }
      } else if (dragStatus === 'drag-thumbnail-tabin' || dragStatus === 'end-split' || dragStatus === 'end-window') {
        overlayStyleLeft = { width: '0px' }
      }
    }
    container = (
      <div className='container'>
        <div className='overlay-right' style={overlayStyleRight} onMouseEnter={overlayMouseEnterHandler} onMouseLeave={overlayMouseLeaveHandler}>
          <div className='overlay-hint'>
            <img src={dragStatus === 'drag-thumbnail-in' ? iconSplitHintActive : iconSplitHint} style={{ width: '40px' }}></img>
            <div className={dragStatus === 'drag-thumbnail-in' ? 'font-subtitle font-split-hint-active' : 'fontsubtitle font-split-hint'}>Open in split screen</div>
          </div>
        </div>
        <div className='overlay-left' style={overlayStyleLeft} onMouseEnter={overlayMouseEnterHandler} onMouseLeave={overlayMouseLeaveHandler}>
          <div className='overlay-hint'>
            <img src={dragStatus === 'drag-thumbnail-in' ? iconSplitHintActive : iconSplitHint} style={{ width: '40px' }}></img>
            <div className={dragStatus === 'drag-thumbnail-in' ? 'font-subtitle font-split-hint-active' : 'fontsubtitle font-split-hint'}>Open in split screen</div>
          </div>
        </div>
        <div className='container-main'>
          <img src={tabList[activeTab].content} style={{ width: '1440px' }}></img>
        </div>
      </div>
    )
    if (dragStatus === 'end-split') {
      console.log('mouseup', 'in')
      container = (
        <div className='container'>
          <div className='container-main'>
            <img src={overlayDirection === 'right' ? tabList[activeTab].content : tabListInit[selectedTab].content} style={{ width: '1440px' }}></img>
          </div>
          <div className='container-main'>
            <img src={overlayDirection === 'right' ? tabListInit[selectedTab].content : tabList[activeTab].content} style={{ width: '1440px' }}></img>
          </div>
        </div>
      )
    } else if (dragStatus === 'end-window') {
      appWindow = (
        <div className='app-container' style={{ position: 'absolute', zIndex: '2', left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}>
          <div className='profile-and-tab'>
            <img src={profileImage} style={{ height: "32px" }}></img>
            <div className='tab'>
              <Tab name={tabListInit[selectedTab].name} favicon={tabListInit[selectedTab].icon} status={'active'} onMouseDown={tabMouseDownHandler} onClick={clickTabHandler}></Tab>
            </div>
          </div>
          <div className='toolbar-and-omnibox'>
            <img src={toolLeftImage} style={{ height: "30px" }}></img>
            <div className='omnibox'>
              <img src={lockImage} style={{ height: '20px' }}></img>
              <div className='color-foreground-hint font-body'>www.google.com</div>
            </div>
            <img src={toolRightImage} style={{ height: "30px" }}></img>
          </div>
          <div className='favorites'>
            <img src={favoritesImage} style={{ height: "28px" }}></img>
          </div>
          <div className='container'>
            <div className='container-main'>
              <img src={tabListInit[selectedTab].content} style={{ width: '1440px' }}></img>
            </div>
          </div>
          <img className='app-close' src={closeImage}></img>
        </div>
      )
    }
  }
  ////////// overlay direction //////////

  ////////// container direction //////////
  if (designDirection === 'container') {
    if (overlayDirection === 'right' && (window.innerWidth / 2 - pivotPoint) > cursorPosition.x) {
      setOverLayDirection('left')
    } else if (overlayDirection === 'left' && (window.innerWidth / 2 + pivotPoint) < cursorPosition.x) {
      setOverLayDirection('right')
    }
    if (overlayDirection === 'right') {
      if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
        overlayStyleRight = { width: '360px', marginLeft: '8px' }
      } else if (dragStatus === 'drag-thumbnail-in') {
        overlayStyleRight = { width: '716px', marginLeft: '8px' }
      } else if (dragStatus === 'drag-thumbnail-tabin' || dragStatus === 'end-split' || dragStatus === 'end-window') {
        overlayStyleRight = { width: '0px' }
      }
    } else if (overlayDirection === 'left') {
      if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init') {
        overlayStyleLeft = { width: '360px', marginRight: '8px' }
      } else if (dragStatus === 'drag-thumbnail-in') {
        overlayStyleLeft = { width: '716px', marginRight: '8px' }
      } else if (dragStatus === 'drag-thumbnail-tabin' || dragStatus === 'end-split' || dragStatus === 'end-window') {
        overlayStyleLeft = { width: '0px' }
      }
    }
    container = (
      <div className='container' style={{ gap: '0px' }}>
        <div className={'container-right'} style={overlayStyleLeft} onMouseEnter={overlayMouseEnterHandler} onMouseLeave={overlayMouseLeaveHandler}>
          <div className='overlay-hint'>
            <img src={dragStatus === 'drag-thumbnail-in' ? iconSplitHintActive : iconSplitHint} style={{ width: '40px' }}></img>
            <div className={dragStatus === 'drag-thumbnail-in' ? 'font-subtitle font-split-hint-active' : 'fontsubtitle font-split-hint'}>Open in split screen</div>
          </div>
        </div>
        <div className='container-main'>
          <img src={tabList[activeTab].content} style={{ width: '1440px' }}></img>
        </div>
        <div className={'container-right'} style={overlayStyleRight} onMouseEnter={overlayMouseEnterHandler} onMouseLeave={overlayMouseLeaveHandler}>
          <div className='overlay-hint'>
            <img src={dragStatus === 'drag-thumbnail-in' ? iconSplitHintActive : iconSplitHint} style={{ width: '40px' }}></img>
            <div className={dragStatus === 'drag-thumbnail-in' ? 'font-subtitle font-split-hint-active' : 'fontsubtitle font-split-hint'}>Open in split screen</div>
          </div>
        </div>
      </div>
    )
    if (dragStatus === 'end-split') {
      console.log('mouseup', 'in')
      container = (
        <div className='container'>
          <div className='container-main'>
            <img src={overlayDirection === 'right' ? tabList[activeTab].content : tabListInit[selectedTab].content} style={{ width: '1440px' }}></img>
          </div>
          <div className='container-main'>
            <img src={overlayDirection === 'right' ? tabListInit[selectedTab].content : tabList[activeTab].content} style={{ width: '1440px' }}></img>
          </div>
        </div>
      )
    } else if (dragStatus === 'end-window') {
      appWindow = (
        <div className='app-container' style={{ position: 'absolute', zIndex: '2', left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}>
          <div className='profile-and-tab'>
            <img src={profileImage} style={{ height: "32px" }}></img>
            <div className='tab'>
              <Tab name={tabListInit[selectedTab].name} favicon={tabListInit[selectedTab].icon} status={'active'} onMouseDown={tabMouseDownHandler} onClick={clickTabHandler}></Tab>
            </div>
          </div>
          <div className='toolbar-and-omnibox'>
            <img src={toolLeftImage} style={{ height: "30px" }}></img>
            <div className='omnibox'>
              <img src={lockImage} style={{ height: '20px' }}></img>
              <div className='color-foreground-hint font-body'>www.google.com</div>
            </div>
            <img src={toolRightImage} style={{ height: "30px" }}></img>
          </div>
          <div className='favorites'>
            <img src={favoritesImage} style={{ height: "28px" }}></img>
          </div>
          <div className='container'>
            <div className='container-main'>
              <img src={tabListInit[selectedTab].content} style={{ width: '1440px' }}></img>
            </div>
          </div>
          <img className='app-close' src={closeImage}></img>
        </div>
      )
    }
  }
  ////////// container direction //////////

  ////////// container-half direction //////////
  if (designDirection === 'container-half') {
    if (overlayDirection === 'right' && (window.innerWidth / 2 - pivotPoint) > cursorPosition.x) {
      setOverLayDirection('left')
    } else if (overlayDirection === 'left' && (window.innerWidth / 2 + pivotPoint) < cursorPosition.x) {
      setOverLayDirection('right')
    }
    if (overlayDirection === 'right') {
      if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init' || dragStatus === 'drag-thumbnail-in') {
        overlayStyleRight = { width: '716px', marginLeft: '8px' }
      } else if (dragStatus === 'drag-thumbnail-tabin' || dragStatus === 'end-split' || dragStatus === 'end-window') {
        overlayStyleRight = { width: '0px' }
      }
    } else if (overlayDirection === 'left') {
      if (dragStatus === 'drag-thumbnail' || dragStatus === 'drag-thumbnail-init' || dragStatus === 'drag-thumbnail-in') {
        overlayStyleLeft = { width: '716px', marginRight: '8px' }
      } else if (dragStatus === 'drag-thumbnail-tabin' || dragStatus === 'end-split' || dragStatus === 'end-window') {
        overlayStyleLeft = { width: '0px' }
      }
    }
    container = (
      <div className='container' style={{ gap: '0px' }}>
        <div className={'container-right'} style={overlayStyleLeft} onMouseEnter={overlayMouseEnterHandler} onMouseLeave={overlayMouseLeaveHandler}>
          <div className='overlay-hint'>
            <img src={dragStatus === 'drag-thumbnail-in' ? iconSplitHintActive : iconSplitHint} style={{ width: '40px' }}></img>
            <div className={dragStatus === 'drag-thumbnail-in' ? 'font-subtitle font-split-hint-active' : 'fontsubtitle font-split-hint'}>Open in split screen</div>
          </div>
        </div>
        <div className='container-main'>
          <img src={tabList[activeTab].content} style={{ width: '1440px' }}></img>
        </div>
        <div className={'container-right'} style={overlayStyleRight} onMouseEnter={overlayMouseEnterHandler} onMouseLeave={overlayMouseLeaveHandler}>
          <div className='overlay-hint'>
            <img src={dragStatus === 'drag-thumbnail-in' ? iconSplitHintActive : iconSplitHint} style={{ width: '40px' }}></img>
            <div className={dragStatus === 'drag-thumbnail-in' ? 'font-subtitle font-split-hint-active' : 'fontsubtitle font-split-hint'}>Open in split screen</div>
          </div>
        </div>
      </div>
    )
    if (dragStatus === 'end-split') {
      console.log('mouseup', 'in')
      container = (
        <div className='container'>
          <div className='container-main'>
            <img src={overlayDirection === 'right' ? tabList[activeTab].content : tabListInit[selectedTab].content} style={{ width: '1440px' }}></img>
          </div>
          <div className='container-main'>
            <img src={overlayDirection === 'right' ? tabListInit[selectedTab].content : tabList[activeTab].content} style={{ width: '1440px' }}></img>
          </div>
        </div>
      )
    } else if (dragStatus === 'end-window') {
      appWindow = (
        <div className='app-container' style={{ position: 'absolute', zIndex: '2', left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}>
          <div className='profile-and-tab'>
            <img src={profileImage} style={{ height: "32px" }}></img>
            <div className='tab'>
              <Tab name={tabListInit[selectedTab].name} favicon={tabListInit[selectedTab].icon} status={'active'} onMouseDown={tabMouseDownHandler} onClick={clickTabHandler}></Tab>
            </div>
          </div>
          <div className='toolbar-and-omnibox'>
            <img src={toolLeftImage} style={{ height: "30px" }}></img>
            <div className='omnibox'>
              <img src={lockImage} style={{ height: '20px' }}></img>
              <div className='color-foreground-hint font-body'>www.google.com</div>
            </div>
            <img src={toolRightImage} style={{ height: "30px" }}></img>
          </div>
          <div className='favorites'>
            <img src={favoritesImage} style={{ height: "28px" }}></img>
          </div>
          <div className='container'>
            <div className='container-main'>
              <img src={tabListInit[selectedTab].content} style={{ width: '1440px' }}></img>
            </div>
          </div>
          <img className='app-close' src={closeImage}></img>
        </div>
      )
    }
  }
  ////////// container-half direction //////////


  return (
    <div className="desktop" onMouseUp={splitTriggerHandler}>
      {appWindow}
      {thumbnail}
      <div className='app-container'>
        <div className='profile-and-tab'>
          <img src={profileImage} style={{ height: "32px" }}></img>
          <div className='tab' onMouseLeave={tabMouseLeaveHandler} onMouseEnter={tabMouseEnterHandler}>
            {tabs}
          </div>
        </div>
        <div className='toolbar-and-omnibox'>
          <img src={toolLeftImage} style={{ height: "30px" }}></img>
          <div className='omnibox'>
            <img src={lockImage} style={{ height: '20px' }}></img>
            <div className='color-foreground-hint font-body'>www.urlplaceholder.com</div>
          </div>
          <img src={toolRightImage} style={{ height: "30px" }}></img>
        </div>
        <div className='favorites'>
          <img src={favoritesImage} style={{ height: "28px" }}></img>
        </div>
        {container}
        <img className='app-close' src={closeImage}></img>
      </div>
      <select name="options" id="options" className='select-options' onChange={selectOptionHandler}>
        <option value="container">Container flexible</option>
        <option value="overlay">Overlay</option>
        <option value="container-half">Container half-size</option>
      </select>
    </div>
  );
}

export default App;
