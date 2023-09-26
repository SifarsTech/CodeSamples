## Purpose
The `getOfferRequestsV1` function is designed to handle HTTP requests for retrieving a list of offer requests based on various query parameters. It interacts with a database to fetch and filter offer requests, handles pagination, and ensures access control based on user roles.

## Use Case
This code is typically used in a web application or API backend to provide functionality for listing offer requests. The primary use cases and functionality of the code are as follows:

### Query Parameters
- `status`: Filter offer requests by a specific status.
- `progress`: Filter offer requests by a specific progress event.
- `exclude`: Exclude offer requests with a specific status.
- `isAssigned`: Filter offer requests based on whether they are assigned or not.
- `q`: Search for offer requests with specific keywords in customer information.
- `sortBy`: Sort the results by different criteria (e.g., assignedTo, submittedBy).
- `sortOrder`: Specify the sorting order (e.g., ASC or DESC).
- `page`: Handle pagination with `limit` and `offset`.

### Authorization
- Authorization is enforced based on user roles. Non-admin users have restricted access.

### Query Building
- The code constructs a complex database query using Sequelize ORM to fetch offer requests meeting the specified criteria.
- It includes related models such as `User`, `Customer`, and `OfferRequestProgress` to retrieve additional information.
- The query is dynamically built based on the provided query parameters.

### Error Handling
- Errors are caught and forwarded to an error handling middleware for appropriate handling.

### Response
- The code responds with a JSON object containing the list of offer requests and pagination information.
- Pagination URLs for the first, last, previous, and next pages are generated.

### Status Codes
- If no results are found, it returns a 204 No Content status code.
- If successful, it returns a 200 OK status code with the JSON response.

## Usage
This code should be integrated into an Express.js or similar Node.js web application as a route handler. It can be invoked when an HTTP GET request is made to a specific endpoint, such as `/api/offer-requests`.

To use this code effectively, ensure that the required Sequelize models (`OfferRequest`, `Customer`, `User`, `OfferRequestProgress`) and appropriate routes are set up in your application.

## Security
The code includes a security definition comment for Swagger, indicating that bearer authentication is required for this endpoint. Ensure that proper authentication and authorization mechanisms are implemented in your application.

## Dependencies
This code relies on the Sequelize ORM and Express.js for database operations and handling HTTP requests, respectively. Make sure to install and configure these dependencies in your project.

## Error Handling
Any errors encountered during the execution of this code are delegated to an error handling middleware (`next(err)`). Ensure that your application has proper error handling in place to handle these errors gracefully.
