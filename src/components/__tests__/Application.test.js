import React from "react";
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

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const {getByText} = render(<Application />);


    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {

  const { container, debug } = render(<Application />);
  //wait for the data to load by waiting for text we know will load
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment")[0]
  //actions to book an interview
  fireEvent.click(getByAltText(appointment,"Add"))
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  fireEvent.click(getByText(appointment, "Save"));

  // debug()

  expect(getByText(appointment, /saving/i)).toBeInTheDocument()

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  const day = getAllByTestId(container,"day").find(day => queryByText(day, "Monday"))

  expect(getByText(day, /no spots remaining/i)).toBeInTheDocument()

})