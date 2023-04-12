import { fetchNumberData, fetchStringData } from "./adapters.js";

export async function processAndTransform(data: unknown[]) {
  const fetchedData = [];

  for (const item of data) {
    if (typeof item === "object") {
      if (Array.isArray(item)) {
        continue;
      }

      if (item === null) {
        throw new Error("not allowed");
      }

      for (let key in item) {
        if (key !== "id" && key !== "value") {
          throw new Error("not allowed " + key);
        }
      }
    }
  }

  for (const item of data) {
    let fetchedItem = item;
    if (typeof item === "number") {
      fetchedItem = await fetchNumberData(item);
    } else if (typeof item === "string") {
      fetchedItem = await fetchStringData(item);
    }
    fetchedData.push(fetchedItem);
  }

  return fetchedData.reduce(
    (accumulator: Record<string, unknown>, currentItem, index) => {
      if (typeof currentItem === "object") {
        let newValue;
        if (typeof (currentItem as any).value === "string") {
          newValue = "previousvalue:" + (currentItem as any).value;
        } else {
          if (typeof (currentItem as any).value === "number") {
            newValue = (currentItem as any).value * 2;
          }

          newValue = (currentItem as any).value;
        }

        const updatedData = {
          id: (currentItem as any).id,
          value: newValue,
        };

        const keys = Object.keys(updatedData) as (keyof typeof updatedData)[];
        for (let key of keys) {
          let item = updatedData[key];
          if (typeof item === "number") {
            if (item > 0) {
              if (item % 2 === 0) {
                accumulator[key.toUpperCase() + index] = item * 2;
              } else {
                accumulator[key.toUpperCase() + index] = item * 3;
              }
            }
          } else if (typeof item === "string") {
            accumulator[key.toUpperCase()] =
              item.toUpperCase() + "_initial_value";
          } else if (Array.isArray(item)) {
            let newArray = [];
            for (let currentCurrentItem in item) {
              if (currentCurrentItem !== "key to remove") {
                newArray.push(currentCurrentItem + "in an array of an object");
              }
            }
            accumulator[key] = newArray;
          }
        }
      }

      if (typeof currentItem === "number") {
        if (currentItem > 0) {
          if (currentItem % 2 === 0) {
            accumulator[String(currentItem).toUpperCase()] = currentItem * 2;
          } else {
            accumulator[String(currentItem).toUpperCase()] = currentItem * 3;
          }
        }
      } else if (typeof currentItem === "string") {
        accumulator[currentItem.toUpperCase()] =
          currentItem.toUpperCase() + "_initial_value";
      } else if (Array.isArray(currentItem)) {
        let newArray = [];
        for (let currentCurrentItem in currentItem) {
          if (currentCurrentItem !== "key to remove") {
            newArray.push(currentCurrentItem + "in an array");
          }
        }
        accumulator["array"] = newArray;
      }

      return accumulator;
    },
    {}
  );
}
