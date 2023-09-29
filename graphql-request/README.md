# Purpose

The `App.js` component is designed to display characters fetched from the Rick and Morty Characters GraphQL API. It leverages the `gql`, `request`, and `useInfiniteQuery` functions from `graphql-request` and `@tanstack/react-query`. This component fetches characters with pagination functionality, initially displaying `20` characters and subsequently fetching more as needed when the "Load More" button is triggered.

## Use Case

This code is typically utilized in web applications built with React or Next.js, offering a robust GraphQL feature set to handle complex queries on the frontend. The primary purposes and functionalities of the code are as follows:

### Imports

- `gql`: Used to define GraphQL queries and mutations.
- `request`: Used to send GraphQL requests to the server.
- `useInfiniteQuery`: A hook provided by the `react-query` library, facilitating pagination and loading additional data as the user scrolls.

### Error Handling

Errors are managed through conditional rendering and checks. If data is available, it is passed to the component to prevent breaking. Default props are also defined to ensure consistency for optional props.

## Usage

This code serves as an example of GraphQL utilization and can be referenced for integration into a React or Next.js web application.

## Dependencies

This code relies on the following dependencies: `graphql-request`, `graphql`, and `@tanstack/react-query`. Be sure to install and configure these dependencies in your project.

## How to Run

To run this project locally, follow these steps:

1. Clone the repository using either the HTTPS or SSH method.

   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory.

   ```bash
   cd [project-directory]
   ```

3. Install the required dependencies using either npm or yarn.

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn install
   ```

4. Start the React server.

   ```bash
   npm start
   ```

   This command will start the development server, and you can access the application in your web browser at the specified URL, typically `http://localhost:3000`.

Make sure you have Node.js and npm (or yarn) installed on your system before proceeding with these steps.
