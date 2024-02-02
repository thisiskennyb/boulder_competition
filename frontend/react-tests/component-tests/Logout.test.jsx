import {expect, it} from "vitest"
import Logout from "../../src/pages/Logout"

it("Logout renders without crashing", ()=> {
    expect(<Logout/>).toMatchSnapshot()
})