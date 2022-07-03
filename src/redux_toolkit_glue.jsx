// Author: Mohit Saini <mohitsaini1196@gmail.com>

// "Redux-Toolkit Glue" is drop-in replacement of Redux-Toolkit. Internally it
// use React's native `useReducer` and `useContext` hooks. It expose
// Redux-Toolkit like interface, which is useful in moving away from
// redux-toolkit without having to change the main code.

import {createContext, useContext, useReducer} from "react";
import produce from "immer"

const GlobalContext = createContext()

export function useSelector(selector) {
  return selector(useContext(GlobalContext).rootState)
}

export function useDispatch() {
  return useContext(GlobalContext).dispatch
}

export function createSlice(slice) {
  slice.reducer = slice
  slice.actions = {}
  for(const reducer_name in slice.reducers) {
    slice.actions[reducer_name] = function(arg) {
      return {slice_name: slice.name, action_type: reducer_name, payload: arg}
    }
  }
  return slice
}

export function configureStore(store) {
  store.initialState = {}
  store.slices = {}
  for (const k in store.reducer) {
    const slice = store.reducer[k]
    const slice_name = slice.name
    store.initialState[slice_name] = slice.initialState
    store.slices[slice_name] = slice
  }
  store.reducerFunc = function(state, action) {
    const reducer = store.slices[action.slice_name].reducers[action.action_type]
    const new_state = produce(state, draft => {
      reducer(draft[action.slice_name], action)
    })
    return new_state
  }
  return store
}

export function Provider({store, children}) {
  const [rootState, dispatch] = useReducer(store.reducerFunc, store.initialState)
  return (
    <GlobalContext.Provider value={{rootState: rootState, dispatch: dispatch}}>
      {children}
    </GlobalContext.Provider>
  );
}
