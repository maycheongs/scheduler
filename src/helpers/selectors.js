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