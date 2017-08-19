class StateApi {
  constructor(rawData) {
    this.data = {
      articles: this.mapIntoObject(rawData.articles),
      authors: this.mapIntoObject(rawData.authors),
      searchTerm: '',
      timestamp: new Date(),
    };

    this.subscriptions = {};
    this.lastSubscriptionId = 0;

  }

  mapIntoObject(arr) {
    return arr.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  subscribe = (cb) => {
    this.lastSubscriptionId ++;
    this.subscriptions[this.lastSubscriptionId] = cb;
    return this.lastSubscriptionId;
  };

  unsubscribe = (id) => {
    delete this.subscriptions[id];
  };

  notifySubscribers = () => {
    Object.values(this.subscriptions).forEach((cb) => cb());
  }

  startClock = () => {
    setInterval(() => {
      this.mergeWithState({
        timestamp: new Date(),
      });
    }, 1000);
  }
  
  mergeWithState = (stateChange) => {
    this.data = {
      ...this.data,
      ...stateChange
    };
    this.notifySubscribers();
  }
  lookupAuthor = (authorId) => {
    return this.data.authors[authorId];
  }

  getState = () => {
    return this.data;
  }

  setSearchTerm = (searchTerm) => {
    this.mergeWithState({
      searchTerm,
    });
  };
}

export default StateApi;
