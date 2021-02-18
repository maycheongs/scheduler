import React, {useEffect, useReducer} from 'react'
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
        const { id, interview, days } = action
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

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        const days = [...state.days];
        //if it is not an edit of an existing interview, spots--
        if (!state.appointments[id].interview) { 
          for (let day of days) {
            if (day.name === state.day) {
              day.spots--
            }
          }
        }
        dispatch({ type: "SET_INTERVIEW", id, interview, days });
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
        dispatch({ type: SET_INTERVIEW, id, days, interview: null });
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
  

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}