import * as moment from "moment-timezone";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";

import styles from "./index.module.scss";
import { offerRequestStatuses, scrollableTargetId } from "../../constant";
import { getEmployees } from "../../services/employee";
import { assignOfferRequest } from "../../services/offerRequestAssignment";
import DropDown from "../drop-down";
import Loader from "../loader";
import Status from "../status";

//  It utilizes the 'offerRequestStatuses' object to retrieve the corresponding label for the 'status' prop.
//  If 'status' is a valid key in the 'offerRequestStatuses' object, it assigns the label to the 'value' prop of the 'Status' component.
//  Additionally, it passes the 'status' prop to the 'statusLabel' prop of the 'Status' component to show relevant label on the UI
function OfferRequestStatus({ status }) {
  return (
    <Status value={offerRequestStatuses[status]?.label} statusLabel={status} />
  );
}

// The 'SubmittedBy' React functional component displays information about a customer who submitted offer request.

// It displays the customer's full name using the 'customer?.fullName' property.
// Additionally, it shows the customer's address, city, and zip code, if available.
function SubmittedBy({ customer }) {
  return (
    <div className={`${styles.submittedByContainer}`}>
      <p>{customer?.fullName}</p>
      <p>
        {customer?.address}, {customer?.city} {customer?.zipCode}
      </p>
    </div>
  );
}

// The 'TimeStampAndStatus' React functional component is responsible for displaying a status and timestamp of the offer request

// It takes two props, 'status' and 'time', which are optional.
// If 'status' is provided, it displays the status.
// If 'time' is provided, it formats and displays it in two paragraphs: one for the date (DD.MM.yyyy) and one for the time (HH:mm).
function TimeStampAndStatus({ status, time }) {
  return (
    <div>
      {status && <p>{status}</p>}
      {time && (
        <>
          <p>{moment(time).format("DD.MM.yyyy")}</p>
          <p>{moment(time).format("HH:mm")}</p>
        </>
      )}
      {!time && <p>-</p>}
    </div>
  );
}

// The 'AssignedEmployee' React functional component is responsible for managing and
//  displaying the assignment of employees to an offer request.

function AssignedEmployee({ employees, request, assignment, className }) {
  // It relies on the 'employees' prop, which represents a list of available employees,
  // and the 'request' and 'assignment' props to determine the current assignment.

  // it utilizes the 'useTranslation' hook to handle internationalization (i18n).
  const { t } = useTranslation("lang");

  // It maintains a piece of state 'assignedEmployee' which holds the currently assigned employee,
  // initializing it with the 'assignment' prop or 'null' if not provided.

  const [assignedEmployee, setAssignedEmployee] = useState(assignment || null);

  // The 'useEffect' hook updates 'assignedEmployee' when 'assignment' changes.
  useEffect(() => {
    if (assignment) {
      setAssignedEmployee(assignment);
    }
  }, [assignment]);

  const onOfferRequestAssign = async (employeeId) => {
    try {
      // The 'onOfferRequestAssign' function is an asynchronous function that assigns an employee to the request
      // using 'assignOfferRequest' and updates 'assignedEmployee' accordingly.

      // 'employee.value' indicates employeeId from the dropdown
      await assignOfferRequest({
        offerRequestId: request.id,
        employeeId,
      });
      setAssignedEmployee(employees.find((emp) => emp.id === employeeId));
      toast.success(t("offer.request.request_assigned"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {/* The component renders a 'DropDown' component with a dropdown list of employees.
        It allows selecting an employee for assignment and displays the assigned employee's name.
        The dropdown is disabled if there's only one employee available. */}
      <DropDown
        selected={assignedEmployee?.id}
        options={employees}
        placeholder="components.data_table.not_assigned"
        onChange={(value) => onOfferRequestAssign(value, request)}
        className={className}
        selectionKey="value"
        disabled={Object.keys(employees).length === 1}
      />
    </div>
  );
}

// The 'DataTable' React component is a versatile table for displaying data, commonly used for managing and viewing lists of offer requests. It can optionally include columns for assigned employees based on the 'showAssignedColumn' prop.

// It receives various props such as 'responseData', 'showAssignedColumn', 'onRowClick', 'isOfferRequestType', 'hasNextPage', and 'fetchNextPage' to configure and display the table.

// Inside the component:
// - It initializes some variables, including the 'headers' array, which defines the table column headers based on the 'showAssignedColumn' prop and translates them using the 'useTranslation' hook.

// - It fetches and sets the 'employees' state if 'showAssignedColumn' is true, allowing the assignment of employees to requests.

// - When 'showAssignedColumn' is enabled, it provides an 'AssignedEmployee' component to assign employees to requests.

function DataTable({
  responseData,
  showAssignedColumn,
  onRowClick,
  isOfferRequestType,
  hasNextPage,
  fetchNextPage,
}) {
  const offerRequests = responseData;

  const { t } = useTranslation("lang");
  const [employees, setEmployees] = useState([]);

  let headers = [];
  if (showAssignedColumn) {
    headers = [
      t("components.data_table.submitted_by"),
      t("components.data_table.received_time"),
      t("components.data_table.completed_time"),
      t("components.data_table.assigned_to"),
      t("components.data_table.status"),
    ];
  } else {
    headers = [
      t("components.data_table.submitted_by"),
      t("components.data_table.received_time"),
      t("components.data_table.completed_time"),
      t("components.data_table.status"),
    ];
  }

  const fetchEmployees = async () => {
    try {
      const {
        data: { data },
      } = await getEmployees();
      setEmployees(
        data.employees.map((emp) => ({
          ...emp,
          label: `${emp.firstName} ${emp.lastName}`,
          value: emp.id,
        }))
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (showAssignedColumn) fetchEmployees();
  }, []);

  return (
    <div className={`${styles.dataTableMainContainer}`}>
      <div className={`${styles.tableHeadingContainer}`}>
        <div
          className={`d-flex align-items-center justify-content-between ${styles.flexContainer}`}
        >
          {headers.map((head) => (
            <div key={head}>{head}</div>
          ))}
        </div>
      </div>
      {/* The 'InfiniteScroll' component is used for handling paginated data, 
      and it dynamically loads more data when the user scrolls to the bottom of the table. */}
      <InfiniteScroll
        dataLength={offerRequests.length}
        hasMore={hasNextPage}
        scrollableTarget={scrollableTargetId}
        loader={<Loader />}
        next={fetchNextPage}
      >
        {/* It maps over the 'offerRequests' and renders each row of data, 
        which includes information about customers, timestamps, assigned employees, 
        and offer request statuses. The 'moment' library is used for timestamp formatting. */}
        {offerRequests.map((request, index) => (
          <div
            role="button"
            onClick={() => onRowClick(request, index)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRowClick(request, index);
              }
            }}
            className={`d-flex align-items-center justify-content-between ${styles.tableContentContainer} ${styles.flexContainer}`}
            key={request.taskId || request.id}
          >
            <div>
              <SubmittedBy customer={request.customer} />
            </div>
            <div>
              <p>{moment(request.createdAt).format("DD.MM.yyyy")}</p>
              <p>{moment(request.createdAt).format("HH:mm")}</p>
            </div>
            <div>
              <TimeStampAndStatus
                status={
                  isOfferRequestType
                    ? t(
                        offerRequestStatuses[
                          request.offerRequestProgress[1]?.event
                        ]?.readableLabel
                      )
                    : ""
                }
                time={
                  isOfferRequestType
                    ? request.offerRequestProgress[0]?.createdAt
                    : request.completedAt
                }
              />
            </div>
            {showAssignedColumn && (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <AssignedEmployee
                  employees={employees}
                  assignment={request.assignment?.employee}
                  request={request}
                  className={`${styles.assignedDropDown}`}
                />
              </div>
            )}
            <div className={styles.statusMainContainer}>
              <OfferRequestStatus
                status={request.offerRequestProgress[0].event}
              />
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

// AssignedEmployee component props validation
AssignedEmployee.propTypes = {
  employees: PropTypes.instanceOf(Array).isRequired, // Expects an array of employees
  request: PropTypes.instanceOf(Object).isRequired, // Expects an object for the request
};

// TimeStampAndStatus component props validation
TimeStampAndStatus.propTypes = {
  status: PropTypes.string.isRequired, // Expects a string for status
  time: PropTypes.string.isRequired, // Expects a string for time
};

// DataTable component props validation
DataTable.propTypes = {
  responseData: PropTypes.instanceOf(Object).isRequired, // Expects an object for responseData
  showAssignedColumn: PropTypes.bool, // Optional boolean prop
  onRowClick: PropTypes.func.isRequired, // Expects a function for onRowClick
  isOfferRequestType: PropTypes.bool, // Optional boolean prop
  hasNextPage: PropTypes.bool, // Optional boolean prop
  fetchNextPage: PropTypes.func, // Optional function prop
};

// DataTable component default props
DataTable.defaultProps = {
  showAssignedColumn: true, // Default value for showAssignedColumn
  isOfferRequestType: true, // Default value for isOfferRequestType
  hasNextPage: false, // Default value for hasNextPage
  fetchNextPage: () => {}, // Default value for fetchNextPage, an empty function
};

// SubmittedBy component props validation
SubmittedBy.propTypes = {
  customer: PropTypes.instanceOf(Object).isRequired, // Expects an object for the customer
};

// OfferRequestStatus component props validation
OfferRequestStatus.propTypes = {
  status: PropTypes.string.isRequired, // Expects a string for status
};

export default DataTable;
