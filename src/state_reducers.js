import {createSlice } from './redux_toolkit_glue';

export const book_slice = createSlice({
  name: 'book_slice',
  initialState: {
    books: [
      {id: 1, is_open: true, price: 10},
      {id: 2, is_open: false, price: 20},
      {id: 3, is_open: true, price: 30},
    ],
    id_counter: 4
  },
  reducers: {
    add: function (state) {
      state.books.push({id: state.id_counter, is_open: false, price: 7})
      state.id_counter += 1
    },
    open: function (state, {payload: book_index}) {
      state.books[book_index].is_open = true
    },
    close: function (state, {payload: book_index}) {
      state.books[book_index].is_open = false
    },
    increase_price: function (state, {payload: {book_index, price}}) {
      state.books[book_index].price += price
    }
  }
})

export default book_slice.reducers
