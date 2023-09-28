# Purpose

The `DataTable` component's function is designed to display offer requests in the UI with various dynamic columns, such as `Customer information`, `Received and Completed timestamps`, `Assignee (to whom this offer request is assigned)`, and `Status` which shows the current status of the offer request. It is a reusable component that serves two types of listings: `Offer requests` and `Tasks`, with a similar structure.

## Use Case

This code is typically used in a web application built with React or Next.js to provide a UI component for displaying offer requests in the user interface. The primary use cases and functionality of the code are as follows:

### Props

- `responseData`: It receives an array of offer requests and lists them.
- `showAssignedColumn`: This is used to show a column based on a condition because at some screens the column is required, and at some, it is not.
- `onRowClick`: This is a function that navigates to a single offer request view screen.
- `isOfferRequestType`: This is used to display status and time based on a condition.
- `hasNextPage`: This prop helps with pagination for infinite scroll to determine whether there are more pages or not.
- `fetchNextPage`: This is a function that helps in fetching more pages.

### Error Handling

- Errors are handled through checks added using chaining and conditional rendering. If the data is available, it is forwarded to the element so that it doesn't break. Default props are also defined to ensure consistency for optional props.

## Usage

This code should be integrated into a React or Next.js web application as a component. It can be displayed by passing all the required data to it on any page where you want to integrate it.

To use this code effectively, ensure that the required components like `DropDown`, `Loader`, and `Status` exist in your application.

**NOTE**: This is a single component of a large application that showcases our React implementation. It will not run as a standalone app.

## Dependencies

This code relies on the following dependencies: `moment-timezone`, `prop-types`, `react-i18next`, `react-infinite-scroll-component`, and `sonner`. Make sure to install and configure these dependencies in your project.
