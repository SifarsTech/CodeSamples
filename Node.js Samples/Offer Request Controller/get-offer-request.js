// Import necessary modules and models
const { roles } = require('../../role/constants');
const {
  OfferRequest,
  Customer,
  OfferRequestProgress,
  User,
  Sequelize,
  sequelize,
} = require('../../models');

// Define an asynchronous function to handle the request
const getOfferRequestsV1 = async (req, res, next) => {
  /*
  This function retrieves a list of offer requests based on various query parameters.
  It also handles pagination and filtering based on user roles and request parameters.
  */

  try {
    // Extract query parameters from the request
    const {
      status,
      progress,
      exclude = {},
      isAssigned,
      q,
      sortBy,
      sortOrder = 'ASC',
      page = {},
    } = req.query;

    // Set default limit and offset values for pagination
    let limit = 10;
    let offset = 0;
    if (page.limit) {
      limit = Number(page.limit);
    }
    if (page.offset) {
      offset = Number(page.offset);
    }

    // Get the user information from the request
    const { user } = req;

    // Define the base query object
    const query = {
      limit,
      offset,
      distinct: true,
      where: {
        id: {
          [Sequelize.Op.and]: [],
        },
      },
      order: [],
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: [] },
          attributes: [],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: [],
        },
        {
          model: OfferRequestProgress,
          as: 'offerRequestProgress',
          attributes: [],
        },
      ],
    };

    // Include OfferRequestProgress model if 'progress' parameter is provided
    if (progress) {
      query.include[2].required = true;
      query.include[2].where = { event: progress };
    }

    // Exclude offer requests with specific status if 'exclude.status' parameter is provided
    if (exclude.status) {
      const excludeQuery = sequelize.dialect.queryGenerator
        .selectQuery('OfferRequestProgresses', {
          attributes: ['offerRequestId'],
          where: {
            event: `${exclude.status}`,
          },
        })
        .slice(0, -1);
      query.where.id[Sequelize.Op.and].push({
        [Sequelize.Op.notIn]: Sequelize.literal(`(${excludeQuery})`),
      });
    }

    // Include offer requests with specific status if 'status' parameter is provided
    if (status) {
      query.where.id[Sequelize.Op.and].push({
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT offerRequestId FROM OfferRequestProgresses WHERE createdAt = (SELECT MAX(createdAt) FROM OfferRequestProgresses AS subquery WHERE subquery.offerRequestId = OfferRequestProgresses.offerRequestId) AND event = '${status}')`
        ),
      });
    }

    // Include only assigned offer requests if 'isAssigned' is 'true'
    if (isAssigned === 'true') {
      query.include[0].required = true;
    }

    // Exclude assigned offer requests if 'isAssigned' is 'false'
    if (isAssigned === 'false') {
      const isAssignedQuery = sequelize.dialect.queryGenerator
        .selectQuery('Assignments', {
          attributes: ['offerRequestId'],
          where: {
            deletedAt: null,
          },
        })
        .slice(0, -1);
      query.where.id[Sequelize.Op.and].push({
        [Sequelize.Op.notIn]: Sequelize.literal(`(${isAssignedQuery})`),
      });
    }

    // Sort the results based on the 'sortBy' and 'sortOrder' parameters
    if (sortBy === 'assignedTo') {
      query.order.push(['users', 'firstName', sortOrder]);
    } else if (sortBy === 'submittedBy') {
      query.order.push(['customer', 'firstName', sortOrder]);
    } else if (sortBy) {
      query.order.push([sortBy, sortOrder]);
    }

    // Perform a search query if 'q' parameter is provided
    if (q) {
      query.include[1].required = true;
      query.include[1].where = {
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.like]: `%${q}%` } },
          { lastName: { [Sequelize.Op.like]: `%${q}%` } },
          { address: { [Sequelize.Op.like]: `%${q}%` } },
        ],
      };
    }

    // Restrict access for non-admin users
    if (!user.roles.includes(roles.ADMIN)) {
      query.include[0].required = true;
      query.include[0].where = { id: user.id };
    }

    // Execute the query to find and count offer requests
    const response = await OfferRequest.findAndCountAll(query);
    const { rows, count } = response;

    // If no results are found, return a 204 No Content response
    if (rows.length === 0) {
      res.status(204).json();
      return;
    }

    // Build pagination URLs
    let queryParams = '';
    Object.keys(req.query).forEach((key) => {
      if (key !== 'page') {
        queryParams += `${key}=${req.query[key]}&`;
      }
    });
    const fullUrl = `${req.originalUrl.split('?')[0]}?${queryParams}`;
    const firstPage = `${fullUrl}page[offset]=${0}&page[limit]=${limit}`;
    const lastPage = `${fullUrl}page[offset]=${
      count > limit ? count - limit : 0
    }&page[limit]=${limit}`;
    let prevPage = null;
    let nextPage = null;
    if (offset > 0) {
      prevPage = `${fullUrl}page[offset]=${
        offset > limit ? offset - limit : 0
      }&page[limit]=${offset > limit ? limit : offset}`;
    }
    if (count > offset + limit) {
      nextPage = `${fullUrl}page[offset]=${
        offset + limit
      }&page[limit]=${limit}`;
    }

    // Return the results and pagination information in the response
    res.status(200).json({
      data: { offerRequests: rows },
      pagination: {
        first: firstPage,
        last: lastPage,
        prev: prevPage,
        next: nextPage,
      },
    });
  } catch (err) {
    // Handle any errors by passing them to the error handling middleware
    next(err);
  }
};

// Export the function for use in other modules
module.exports = { getOfferRequestsV1 };
