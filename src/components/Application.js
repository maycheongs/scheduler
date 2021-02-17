import React, {useState, useEffect} from "react";

import axios from 'axios'
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment"
import {getAppointmentsForDay, getInterview} from "../helpers/selectors"



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
  function setDays(days) {
    setState(prev=> ({...prev, days}))
  }
  function setAppointments(appointments) {
    setState(prev=> ({...prev, appointments}))
  }
  
 
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then(responses => {
      setState(prev => ({...prev,
        days:responses[0].data, 
        appointments: responses[1].data,
        interviewers: responses[2].data
      }))
    })    

   

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
          
    return (
      <Appointment
        {...appointment}
        key={appointment.id}        
        interview={interview}        
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
