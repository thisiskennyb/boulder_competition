import {expect, test} from "vitest"
import Activation from "../../src/pages/Activation"

test("Activation renders without crashing", () => {
        expect(<Activation/>).toMatchSnapshot()
    })
