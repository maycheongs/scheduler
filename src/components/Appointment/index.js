import React from 'react';
import './styles.scss'
import Header from './Header'
import Show from './Show'
import Empty from './Empty'
import Form from './Form'
import Status from './Status'
import Confirm from './Confirm'
import Error from './Error'
import useVisualMode from '../../hooks/useVisualMode'


export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE = "ERROR_SAVE";
  const EDIT = "EDIT";

  const initialMode = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initialMode);

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }

  function onDelete() {

    transition(DELETING, true);
    props.deleteInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
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
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving.."
        />
      )}
      {mode === DELETING && (
        <Status
          message="Deleting.."
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={onDelete}
          onCancel={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete appointment"
          onClose={back}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save changes"
          onClose={back}
        />
      )}

    </article>
  )
}