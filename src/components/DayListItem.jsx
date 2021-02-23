import React from 'react';
import './DayListItem.scss';
import classNames from 'classnames';

export default function DayListItem(props) {

  const classes = classNames('day-list__item',
  {'day-list__item--selected': props.selected},
  {'day-list__item--full': props.spots === 0}
  )

  function formatSpots(){
    switch(props.spots) {
      case 0:
        return "no spots remaining";
      case 1:
        return "1 spot remaining";
      default:
        return `${props.spots} spots remaining`;
    }
  }

  return (
    <li onClick={()=> props.setDay(props.name)} className={classes} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  )

}