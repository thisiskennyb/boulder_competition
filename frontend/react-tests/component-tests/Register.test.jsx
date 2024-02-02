import {expect, test} from "vitest"
import Register from "../../src/pages/Register"

test("Register renders without crashing", ()=> {
    const component = <Register/>;
    expect(component).toMatchSnapshot();
})