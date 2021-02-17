import React, {useState, useEffect} from "react";

import axios from 'axios'
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment"
import {getAppointmentsForDay, getInterview, getInterviewersForDay} from "../helpers/selectors"



export default function Application(props) {
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
      setState({...state, appointments});
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
      setState({...state, appointments});
    })
    .catch(err => err)    
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

   
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day); 

  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    
    return (
      <Appointment
        {...appointment}
        key={appointment.id}        
        interview={interview}
        interviewers={interviewers}
        bookInterview = {bookInterview}
        deleteInterview= {deleteInterview}     
      />
    )
  })


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
        
      </section>
    </main>

    
  );
}
