import { useEffect, useReducer } from 'react'
import axios from 'axios'
import reducer, {SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA} from '../reducers/application'

export default function useApplicationData() {

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