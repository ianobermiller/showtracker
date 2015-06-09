const lastID = 0;
const subscribers = [];

const Dispatcher = {
  dispatch(event) {
    subscribers.forEach(subscriber => subscriber.handler(event));
  },

  subscribe(handler) {
    const id = lastID + 1;
    subscribers.push({id, handler});
    return {
      remove() {
        subscribers = subscribers.filter(s => s.id !== id);
      }
    };
  }
};

module.exports = Dispatcher;
