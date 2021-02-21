
//takes in state and day STRING to return an array of complete appointment objects
export function getAppointmentsForDay(state, day) {

  let appointments = [];

  for (let dayObj of state.days) {
    if (dayObj.name === day) {
      appointments = dayObj.appointments
    }
  }
  const appointmentArr = appointments.map(num => {
    return state.appointments[num]
  })

  return appointmentArr
}

//takes in state and compressed interview obj ie interview:{student:name, interviewer:id})
//to return interview with full interviewer details

export function getInterview(state, interview){
  if(!interview) return null;

  const interviewerId = interview.interviewer;
  return {...interview, interviewer: state.interviewers[interviewerId]}
}


//takes in state and day STRING to return an array of complete interviewer objects (not just id)
export function getInterviewersForDay(state, day) {

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

export function deepCopy(obj) {

  if(typeof obj === "object"){
    if(Array.isArray(obj)){
      return obj.reduce((arr, item, i) => {
        arr[i] = deepCopy(item);
        return arr;
    }, []);
    } else {
      return Object.keys(obj).reduce((newObj, key) => {
        newObj[key] = deepCopy(obj[key]);
        return newObj;
    }, {})
    }
  }
  return obj
}