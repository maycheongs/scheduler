import reducer from './application'

describe("reducer function", () => {
  it("throws an error with an unsupported type", () => {

    expect(()=> reducer({}, {type: null})).toThrowError(/unsupported action type/i)

  })
})