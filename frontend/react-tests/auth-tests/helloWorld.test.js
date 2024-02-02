import {expect, test} from "vitest"

function helloWorld() {
    return "Hello World!"
}

test("Verifies Vitest is working", () => {
    expect(helloWorld()).toBe("Hello World!")

})