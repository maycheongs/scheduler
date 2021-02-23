import React from "react";
import axios from 'axios';
import {
  waitForElement,
  fireEvent,
  getByText,
  queryByText,
  getByAltText,
  getByPlaceholderText,
  getAllByTestId,
  prettyDOM,
} from "@testing-library/react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";
import { getAppointmentsForDay } from "helpers/selectors";

afterEach(cleanup);

describe("Application", () => {



it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));
  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  const { container, debug } = render(<Application />);
  //wait for the data to load by waiting for text we know will load
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment")[0];
  //actions to book an interview
  fireEvent.click(getByAltText(appointment, "Add"));
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  fireEvent.click(getByText(appointment, "Save"));

  // debug()

  expect(getByText(appointment, /saving/i)).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
});

it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  // 1. Render the Application.
  const { container } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Delete" button on Archie Cohen's appointment.
  const appointment = getAllByTestId(
    container,
    "appointment"
  ).find((appointment) => queryByText(appointment, "Archie Cohen"));
  fireEvent.click(getByAltText(appointment, "Delete"));

  // 4. Check that the confirmation element with the text "Delete the appointment" is displayed.
  expect(getByText(appointment, /delete the appointment/i)).toBeInTheDocument();

  // 5. Click the "Confirm" button on the appointment.
  fireEvent.click(getByText(appointment, "Confirm"));

  // 6. Check that the status element with the text "Deleting" is displayed.
  expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

  // 7. Wait until the appointment has element with "Add"
  await waitForElement(() => getByAltText(appointment, "Add"));

  // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );
  expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  // 1. Render the Application.
  const { container } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Edit" button on Archie Cohen's appointment.
  const appointment = getAllByTestId(
    container,
    "appointment"
  ).find((appointment) => queryByText(appointment, "Archie Cohen"));
  fireEvent.click(getByAltText(appointment, "Edit"));

  // 4. Check that getByPlaceholder "Enter Student Name" has Archie Cohen
  const input = getByPlaceholderText(appointment, "Enter Student Name");
  expect(input.value).toBe("Archie Cohen");

  // 5. Change the name to "May"
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });
  // 6. Click the "Save" button on the appointment
  fireEvent.click(getByText(appointment, "Save"));
  // 7. Check that the element with the text "Saving" is displayed.
  expect(getByText(appointment, /saving/i)).toBeInTheDocument();
  // 8. Wait until the element with the text "May" is displayed.
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
});

it("shows the save error when failing to save an appointment", async () => {
  axios.put.mockRejectedValueOnce();

  const { container, debug } = render(<Application />);
  //wait for the data to load by waiting for text we know will load
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment")[0];
  //actions to book an interview
  fireEvent.click(getByAltText(appointment, "Add"));
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  fireEvent.click(getByText(appointment, "Save"));

  expect(getByText(appointment, /saving/i)).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, /could not save/i));
  fireEvent.click(getByAltText(appointment, "Close"));

  expect(getByPlaceholderText(appointment,"Enter Student Name").value).toBe("")

});

it("shows the delete error when failing to delete an existing appointment", async () => {
  axios.delete.mockRejectedValueOnce();

  const { container, debug } = render(<Application />);
  //wait for the data to load by waiting for text we know will load
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(
    container,
    "appointment"
  ).find((appointment) => queryByText(appointment, "Archie Cohen"));
  fireEvent.click(getByAltText(appointment, "Delete"));

  // Check that the confirmation element with the text "Delete the appointment" is displayed.
  expect(getByText(appointment, /delete the appointment/i)).toBeInTheDocument();

  fireEvent.click(getByText(appointment, "Confirm"));
  expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
  await waitForElement(() => getByText(appointment, /could not delete appointment/i));

});

})