import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function useApplicationData() {


  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  function setDay(day) {
    setState(prev => ({...prev, day}))
  }

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    
          
    
    return axios.put(`/api/appointments/${id}`,{interview})
    .then(() => {
      const days = [...state.days];
      if (!state.appointments[id].interview) {
        for (let day of days) {
          if (day.name === state.day) {
            day.spots--
          }
        }
      }       
      setState({...state, appointments,days});
    })    
  }

  

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const days = [...state.days]
        for (let day of days) {
          if (day.name === state.day) {
            day.spots++
          }
        }
        setState({ ...state, appointments, days });
      })    
  }

  useEffect(() => {

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(([days,appointments,interviewers]) => {
      setState(prev => ({...prev,
        days:days.data, 
        appointments: appointments.data,
        interviewers: interviewers.data
      }))
    })    
  },[])

  useEffect(()=> {

  },[state.appointments])

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }


}