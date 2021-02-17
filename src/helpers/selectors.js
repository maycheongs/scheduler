export function getAppointmentsForDay(state, day) {

  let appointments = [];

  for (let dayObj of state.days) {
    if (dayObj.name === day) {
      appointments = dayObj.appointments
    }
  }

  const appointmentArr = appointments.map(num=>{
    return state.appointments[num]
  })

  return appointmentArr
}

export function getInterview(state, interview){
  if(!interview) return null;

  const interviewerId = interview.interviewer;
  return {...interview, interviewer: state.interviewers[interviewerId]}
}

export function getInterviewersForDay(state,day){

  let interviewerIds = [];

  for (let dayObj of state.days) {
    if (dayObj.name === day) {
      interviewerIds = dayObj.interviewers
    }
  }

  const interviewerArr = interviewerIds.map(id => {
    return state.interviewers[id]
  })
  return interviewerArr
}