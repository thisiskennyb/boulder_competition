import {expect, it} from "vitest"
import Profile from "../../src/pages/Profile"

it("Profile renders without crashing", ()=> {
    expect(<Profile/>).toMatchSnapshot()
})