
export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

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

export default function reducer(state, action) {
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