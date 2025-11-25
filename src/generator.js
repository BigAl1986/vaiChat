const range = {
  from: 1,
  to: 15,
  // [Symbol.iterator]() {
  //   let current = this.from;
  //   return {
  //     next: () => {
  //       if (current <= this.to) {
  //         return { value: current++, done: false };
  //       } else {
  //         return { done: true };
  //       }
  //     },
  //   };
  // },
  // *[Symbol.iterator]() {
  //   for (let current = this.from; current <= this.to; current++) {
  //     yield current;
  //   }
  // },
  async *[Symbol.asyncIterator]() {
    for (let current = this.from; current <= this.to; current++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      yield current;
    }
  },
};

// const run = () => {
const run = async () => {
  // for (const item of range) {
  for await (const item of range) {
    console.log("item===", item);
  }
};

run();
