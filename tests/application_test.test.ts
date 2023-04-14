import { describe, test, expect } from "vitest";
import { processAndTransform } from "../src/index.js";

describe("processAndTransform", () => {
  test("processAndTransform", async () => {
    const inputData = [
      { id: 1, value: 10 },
      20,
      "test",
      { id: 2, value: 25 },
      { id: 3, value: "value vlaue" },
      { id: 4, value: ["item1", "Item2"] },
      40,
      3,
      "another test",
      [1, 2, 3, 4, 5, 6],
    ];

    const expectedOutput = {
      "21": 63,
      "4": 8,
      "41": 123,
      ID0: 3,
      ID3: 4,
      ID4: 9,
      ID5: 8,
      VALUE0: 20,
      VALUE3: 75,
      VALUE: "PREVIOUSVALUE:VALUE VLAUE_initial_value",
      "ANOTHER TEST_FETCHED": "ANOTHER TEST_FETCHED_initial_value",
      TEST_FETCHED: "TEST_FETCHED_initial_value",
      array: [
        "0in an array",
        "1in an array",
        "2in an array",
        "3in an array",
        "4in an array",
        "5in an array",
      ],
      value: ["0in an array of an object", "1in an array of an object"],
    };

    const result = await processAndTransform(inputData);
    expect(result).toEqual(expectedOutput);
  });

  test("processAndTransform null", async () => {
    const inputData = [[], null];

    await expect(() =>
      processAndTransform(inputData)
    ).rejects.toThrowErrorMatchingInlineSnapshot('"not allowed"');
  });

  test("processAndTransform valid", async () => {
    const inputData = [{ valid: false }];

    await expect(() =>
      processAndTransform(inputData)
    ).rejects.toThrowErrorMatchingInlineSnapshot('"not allowed valid"');
  });

  test("processAndTransform boolean", async () => {
    const inputData = [{ id: false }];

    await expect(() =>
      processAndTransform(inputData)
    ).rejects.toThrowErrorMatchingInlineSnapshot('"Boolean not accepted"');
  });

  test("processAndTransform object", async () => {
    class Base {
      propertyName: string;

      constructor(a: string) {
        this.propertyName = a;
      }
    }

    class NewClass extends Base {}
    const inputData = [new NewClass("value")];

    await expect(() =>
      processAndTransform(inputData)
    ).rejects.toThrowErrorMatchingInlineSnapshot('"not allowed propertyName"');
  });
});
