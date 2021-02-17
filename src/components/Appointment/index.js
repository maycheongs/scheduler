import React, {Fragment} from 'react';
import './styles.scss'
import Header from './Header'
import Show from './Show'
import Empty from './Empty'
import Form from './Form'
import useVisualMode from '../../hooks/useVisualMode'


export default function Appointment(props){

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const initialMode = props.interview ? SHOW : EMPTY;
  const {mode,transition,back} = useVisualMode(initialMode);
  function save (name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview);
    transition(SHOW)
  }

  return (
    <article className="appointment">

      <Header
        time={props.time}
      />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form 
        interviewers={props.interviewers}
        onSave={save}
        onCancel={console.log("onCancelForm")}
        />
      )}

    </article>
  )
}