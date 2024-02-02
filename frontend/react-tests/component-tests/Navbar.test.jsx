import {expect, test } from "vitest"
import Navbar from "../../src/components/Navbar"

test("Navbar renders without crashing", () => {
    const component = <Navbar/>;
    expect(component).toMatchSnapshot();
})