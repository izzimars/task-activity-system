const states = {
  primaryUser: {
    id: null as string | null,
    token: null as string | null,
    email: null as string | null
  },
  secondaryUser: {
    id: null as string | null,
    token: null as string | null,
    email: null as string | null
  },
  tasks: {
    primaryTaskId: null as string | null,
    secondaryTaskId: null as string | null
  }
};

export default states;
