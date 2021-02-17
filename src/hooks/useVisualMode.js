import React, {useState} from 'react'
export default function useVisualMode(initialMode){

  const [mode,setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])
  const transition = (newMode, bool) => {
    const newHistory = [...history];
    if (bool && newHistory.length > 1) {
      newHistory.pop()
    }
    newHistory.push(newMode)
    setHistory([...newHistory]);
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