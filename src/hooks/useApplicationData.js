import {useEffect, useReducer} from 'react'
import axios from 'axios'

export default function useApplicationData() {
  
  
  
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        const { day } = action
        return { ...state, day }
      case SET_APPLICATION_DATA:
        const { days, appointments, interviewers } = action
        return { ...state, days, appointments, interviewers }
      case SET_INTERVIEW: {
        const { id, interview} = action
        let days = [...state.days]
        if (action.days) days = action.days
        return { ...state, days, appointments: { ...state.appointments, [id]: { ...state.appointments[id], interview } } }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function setDay(day) {
    dispatch({ type: SET_DAY, day })
  }

  //takes in the state, type "put"/"delete" and appointment id(for puts) to update open spots for the day the appointment is in.
  
  function updateDaysWithSpots(state,type,id=null) {

    const newDays = state.days.map(day=> {
      if(day.appointments.indexOf(id) >= 0) {
        if (type === "put" && !state.appointments[id].interview) {
          day.spots--
        }
        if (type ==="delete") {
          day.spots++
        }       
      }
      return day      
    })
    return newDays
  }

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {        
        dispatch({ type: "SET_INTERVIEW", id, interview });
      })
  }
    
    
  function deleteInterview(id) {

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {        
        dispatch({ type: SET_INTERVIEW, id, interview: null });
      })
  }

  useEffect(() => {

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(([days, appointments, interviewers]) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      })
    })
  }, [])  


  useEffect(() => {

    const webSocket = new WebSocket("ws://localhost:8001", "json")

    webSocket.onmessage = function (event) {
      const {id, interview} = JSON.parse(event.data)
      let days = [...state.days]
      if(!interview) {
        days = updateDaysWithSpots(state,"delete")        
      } else {
        days = updateDaysWithSpots(state,"put",id)
      }
      dispatch({type:SET_INTERVIEW, id, interview, days});      
    }

    return () => webSocket.close();
  },[state])
  

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}