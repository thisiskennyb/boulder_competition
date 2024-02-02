import {expect, test} from "vitest"
import Login from "../../src/pages/Login"

test("Login renders without crashing", ()=> {
    const component = <Login/>;
    expect(component).toMatchSnapshot()
})