export async function* mapActionToState(
  state = { count: 10, msg: "" },
  action
) {
  switch (action.type) {
    case "Inc":
      yield { count: state.count + 1, msg: "" };
      break;
    case "Dec":
      yield { count: state.count - 1, msg: "" };
      break;
    case "AsyncInc":
      yield { count: state.count, msg: " loading..." };
      const count = await getData(state.count);
      yield { msg: "", count };
      break;
    default:
      yield state;
  }
}

function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + Math.floor(Math.random() * 15));
    }, 1000);
  });
}
