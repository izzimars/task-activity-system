export const taskFixtures = {
  createPrimaryTask: {
    title: "Primary user task",
    description: "Task owned by primary user"
  },
  createSecondaryTask: {
    title: "Secondary user task",
    description: "Task owned by secondary user"
  },
  missingTitle: {
    description: "Missing title payload"
  },
  statusDone: {
    status: "done"
  },
  invalidStatus: {
    status: "archived"
  }
};

export default taskFixtures;
