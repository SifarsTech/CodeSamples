### Purpose:

The `CustomerInformation` component is designed to display and edit customer details, including information such as first name, last name, email, phone number, address, zip code, and city. It is part of a larger application that handles offer requests and their associated data.

### Props:

The component accepts the following props:

1. `customerDetails`: An object containing customer details.
2. `onUpdateCustomerDetails`: A function used to update customer details.
3. `offerRequest`: An object containing offer request details.
4. `onUpdateOfferRequest`: A function used to update offer request details.
5. `apiError`: Error message from the API.

### Usage:

The component is used to create a form for editing customer information and address details. It relies on the Yup library for form validation and React Hook Form (`useForm`) for managing form state.

Key functionality and usage steps in the component:

1. It sets up form validation using Yup schema validation for various customer fields.
2. It uses React Hook Form to manage form state, including form values, errors, and form submission.
3. It watches for changes in form inputs and updates the `customerDetails` and `offerRequest` objects accordingly.
4. It populates form fields with initial values from the `customerDetails` and `offerRequest` objects.
5. It handles API errors by displaying error messages and marking specific fields as invalid when API errors occur.

**NOTE**: This is a single component of a large application that showcases our React implementation. It will not run as a standalone app.

### Error Handling

- Errors are handled through checks added using chaining and conditional rendering. If the data is available, it is forwarded to the element so that it doesn't break. Default props are also defined to ensure consistency for optional props.

## Dependencies

This code relies on the following dependencies: `@hookform/resolvers/yup`, `prop-types`, `react-hook-form`, `yup`, and `sonner`. Make sure to install and configure these dependencies in your project.
