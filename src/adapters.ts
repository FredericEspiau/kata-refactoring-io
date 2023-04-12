export async function fetchNumberData(item: number): Promise<number> {
  // Simulating a data fetch with a Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(item + 1);
    }, 100);
  });
}

export async function fetchStringData(item: string): Promise<string> {
  // Simulating a data fetch with a Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(item + "_fetched");
    }, 100);
  });
}
