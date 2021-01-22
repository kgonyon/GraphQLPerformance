const count = 10000;
const resolvers = {
  Query: {
    /**
     * This resolver is all sync and just returns the results
     */
    fast: () => {
      return createResults(count);
    },
    /**
     * This resolver is all sync and just returns the results, but the sync name field resolver will run fine.
     */
    fastField: () => {
      return createResults(count);
    },
    /**
     * This resolver maps all the rows to a promise before returning them.
     */
    fastAsync: async () => {
      const results = createResults(count);
      return Promise.all(results.map(async (result) => result))
    },
    /**
     * This resolver maps all the rows to a promise and each result will also run the name field resolver.
     */
    fastFieldAsync: () => {
      const results = createResults(count);
      return Promise.all(results.map(async (result) => result))
    },
    /**
     * This is the call that has huge performance problems. 
     * It is the same as fast, but it has an async name field resolver.
     */
    slow: () => {
      return createResults(count);
    }
  },
  FastResultFieldResolver: {
    name: (source) => source.name
  },
  SlowResult: {
    name: async (source) => source.name
  }
}

function createResults(count) {
  let current = count;
  const result = {
    id: "id",
    name: "name"
  }
  const results = []
  while (current > 0) {
    results.push({ ...result });
    current -= 1
  }
  return results;
}

module.exports.resolvers = resolvers;