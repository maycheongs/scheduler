import React, {useState} from 'react'
export default function useVisualMode(initialMode){

  const [mode,setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  const transition = (newMode, bool) => {
    if (bool && history.length > 1) {
      setHistory(prev => [...prev].slice(0, prev.length - 1))
    }    
    setHistory(prev => [...prev, newMode]);
    setMode(newMode);    
  }

  const back = () => {
    if (history.length > 1) {
      const prevHistory = [...history]
      prevHistory.pop();
      const [prevMode] = prevHistory.slice(-1)
      setHistory([...prevHistory]);
      setMode(prevMode) 
    }
  }


  return (
    {mode, transition, back}
  )

}