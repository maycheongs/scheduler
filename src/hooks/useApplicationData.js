import { useEffect, useReducer } from 'react'
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
        const { id, interview } = action
        const newState = { ...state, appointments: { ...state.appointments, [id]: { ...state.appointments[id], interview } } }
        const days = daysWithUpdatedSpots(newState);
        return { ...newState, days }
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

  //takes in the state and returns days array with correct number of open spots in each day
  function daysWithUpdatedSpots(state) {
    const newDays = state.days.map(day => {
      let spots = 0
      day.appointments.forEach(apptId => {
        if (!state.appointments[apptId].interview) {
          spots++
        }
      })
      const dayBuffer = {...day, spots}
      return dayBuffer;
    })
    return newDays;
  }

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview });
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

  //I suppose it could be in the same useEffect but this is clearer (to me)
  useEffect(() => {

    const webSocket = new WebSocket("ws://localhost:8001", "json")

    webSocket.onmessage = function (event) {
      const { id, interview } = JSON.parse(event.data)
      dispatch({ type: SET_INTERVIEW, id, interview });
    }

    return () => webSocket.close();
  }, [])


  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}