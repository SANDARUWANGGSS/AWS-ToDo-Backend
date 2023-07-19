/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const findAllTodos = /* GraphQL */ `
  query FindAllTodos($input: TodoSearchInput) {
    findAllTodos(input: $input) {
      id
      name
      description
      completed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($input: TodoSearchInputById) {
    getTodo(input: $input) {
      id
      name
      description
      completed
      createdAt
      updatedAt
      __typename
    }
  }
`;
