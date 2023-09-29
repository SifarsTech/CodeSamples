import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

import styles from "./index.module.scss";
import TextControl from "../../../components/form-fields/text-control";
import Translate from "../../../components/translate";
import { getOriginalErrors } from "../../../utils/errorHandler";

// A functional component for rendering a first name input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `error`: Error message to display if there's a validation error
function FirstNameInput({ register, error }) {
  return (
    <div>
      <TextControl
        label="components.user.first_name"
        placeholder="John"
        name="firstName"
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering a last name input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `error`: Error message to display if there's a validation error
function LastNameInput({ register, error }) {
  return (
    <div>
      <TextControl
        label="components.user.last_name"
        placeholder="Doe"
        name="lastName"
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering an email input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `error`: Error message to display if there's a validation error
function EmailInput({ register, error }) {
  return (
    <div>
      <TextControl
        label="components.user.email"
        type="email"
        placeholder="johndoe@example.com"
        name="email"
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering a phone number input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `error`: Error message to display if there's a validation error
function PhoneInput({ register, error }) {
  return (
    <div>
      <TextControl
        label="components.user.phone"
        placeholder="+000XXXXXXX"
        name="phone"
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering an address input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `name`: Name attribute for the input field
// - `error`: Error message to display if there's a validation error
function AddressInput({ register, name, error }) {
  return (
    <div>
      <TextControl
        label="components.address.address"
        placeholder="22 Corona St. New Baltimore, MI 48047"
        name={name}
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering a zip code input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `name`: Name attribute for the input field
// - `error`: Error message to display if there's a validation error
function ZipCodeInput({ register, name, error }) {
  return (
    <div>
      <TextControl
        label="components.address.zip_code"
        placeholder="R45 5D5"
        name={name}
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering a city input field
// Props:
// - `register`: React Hook Form's `register` function for connecting the input to the form
// - `name`: Name attribute for the input field
// - `error`: Error message to display if there's a validation error
function CityInput({ register, name, error }) {
  return (
    <div>
      <TextControl
        label="components.address.city"
        placeholder="Helsinki"
        name={name}
        register={register}
      />
      {error && <div className={`${styles.errorLabel}`}>{error}</div>}
    </div>
  );
}

// A functional component for rendering a set of address-related input fields (Address, Zip Code, City)
// Props:
// - `register`: React Hook Form's `register` function for connecting the inputs to the form
// - `addressInputName`: Name attribute for the address input field
// - `zipCodeInputName`: Name attribute for the zip code input field
// - `cityInputName`: Name attribute for the city input field
// - `errors`: Object containing validation error messages for each input
function AddressControl({
  register,
  addressInputName,
  zipCodeInputName,
  cityInputName,
  errors,
}) {
  return (
    <div
      className={`d-md-flex flex-md-wrap justify-content-between ${styles.addressColumn}`}
    >
      <AddressInput
        register={register}
        name={addressInputName}
        error={errors[addressInputName]?.message}
      />
      <ZipCodeInput
        register={register}
        name={zipCodeInputName}
        error={errors[zipCodeInputName]?.message}
      />
      <CityInput
        register={register}
        name={cityInputName}
        error={errors[cityInputName]?.message}
      />
    </div>
  );
}

// A functional component for rendering a toggle switch input to indicate if the installation address is different
// Props:
// - `value`: Current value of the switch (true/false)
// - `setValue`: Function to set the value of the switch
function IsTargetInstallationAddressDifferent({ value, setValue }) {
  return (
    <label
      className="switch"
      htmlFor="is_the_address_of_the_installation_target_different"
    >
      <Translate id="offer.request.is_the_address_of_the_installation_target_different" />
      <input
        className="switchInput"
        type="checkbox"
        checked={value}
        id="is_the_address_of_the_installation_target_different"
        onChange={(event) =>
          setValue("isTargetInstallationAddressDifferent", event.target.checked)
        }
      />
      <span className="slider round">
        <Translate id="common.yes" />
      </span>
    </label>
  );
}

// A React component for rendering customer information and address details
// Props:
// - `customerDetails`: Object containing customer details
// - `onUpdateCustomerDetails`: Function to update customer details
// - `offerRequest`: Object containing offer request details
// - `onUpdateOfferRequest`: Function to update offer request details
// - `apiError`: Error message from the API
function CustomerInformation({
  customerDetails,
  onUpdateCustomerDetails,
  offerRequest,
  onUpdateOfferRequest,
  apiError,
}) {
  const customerSchema = yup.object({
    // Define schema for various customer fields
    firstName: yup.string(), // Validation for first name as a string
    lastName: yup.string(), // Validation for last name as a string
    email: yup.string(), // Validation for email as a string
    phone: yup.string(), // Validation for phone as a string
    address: yup.string(), // Validation for address as a string
    zipCode: yup.string(), // Validation for zip code as a string
    city: yup.string(), // Validation for city as a string
    installationTargetAddress: yup.string(), // Validation for installation target address as a string
    installationTargetCity: yup.string(), // Validation for installation target city as a string
    installationTargetZipCode: yup.string(), // Validation for installation target zip code as a string
    isTargetInstallationAddressDifferent: yup.boolean().default(false), // Validation for a boolean field with a default value of 'false'
  });

  const {
    register,
    formState: { errors },
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    resolver: yupResolver(customerSchema),
  });

  watch(
    (
      {
        firstName,
        lastName,
        email,
        phone,
        address,
        zipCode,
        city,
        installationTargetAddress,
        installationTargetCity,
        installationTargetZipCode,
        isTargetInstallationAddressDifferent,
      },
      name
    ) => {
      onUpdateCustomerDetails((prev) => ({
        ...prev,
        firstName,
        lastName,
        email,
        phone,
        address,
        zipCode,
        city,
      }));
      onUpdateOfferRequest((prev) => ({
        ...prev,
        installationTargetAddress: isTargetInstallationAddressDifferent
          ? installationTargetAddress
          : address,
        installationTargetCity: isTargetInstallationAddressDifferent
          ? installationTargetCity
          : city,
        installationTargetZipCode: isTargetInstallationAddressDifferent
          ? installationTargetZipCode
          : zipCode,
        isTargetInstallationAddressDifferent,
      }));
      clearErrors(name.name);
    }
  );

  useEffect(() => {
    reset({
      ...customerDetails,
      ...offerRequest,
      firstName: customerDetails.firstName || "",
      lastName: customerDetails.lastName || "",
      email: customerDetails.email || "",
      phone: customerDetails.phone || "",
      address: customerDetails.address || "",
      zipCode: customerDetails.zipCode || "",
      city: customerDetails.city || "",
    });
  }, []);

  useEffect(() => {
    if (apiError) {
      const originalErrors = getOriginalErrors(apiError);
      originalErrors.forEach((error) => {
        if (error.field) {
          setError(error.field, { message: error.message });
        } else {
          toast.error(error.message);
        }
      });
    }
  }, [apiError]);

  return (
    <div className={`${styles.customerInformationContainer}`}>
      <div className={`${styles.headerContainer}`}>
        <h1 className={`${styles.headerTitle}`}>
          <Translate id="offer.request.customer_information" />
        </h1>
      </div>
      <form>
        <div
          className={`d-md-flex flex-md-wrap justify-content-between ${styles.contentContainer}`}
        >
          <FirstNameInput
            register={register}
            error={errors.firstName?.message}
          />
          <LastNameInput register={register} error={errors.lastName?.message} />
          <EmailInput register={register} error={errors.email?.message} />
          <PhoneInput register={register} error={errors.phone?.message} />
          <AddressControl
            register={register}
            addressInputName="address"
            zipCodeInputName="zipCode"
            cityInputName="city"
            errors={errors}
          />
        </div>
        <div className={`${styles.addressContainer}`}>
          <div className={`${styles.sliderBtnContainer}`}>
            <IsTargetInstallationAddressDifferent
              value={offerRequest.isTargetInstallationAddressDifferent}
              setValue={setValue}
            />
          </div>
          {offerRequest.isTargetInstallationAddressDifferent && (
            <div className={`${styles.addressContent}`}>
              <h2 className={`${styles.headerTitle}`}>
                <Translate id="offer.request.enter_the_address_of_the_installation_target" />
              </h2>
              <AddressControl
                register={register}
                addressInputName="installationTargetAddress"
                zipCodeInputName="installationTargetCity"
                cityInputName="installationTargetZipCode"
                errors={errors}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
// PropTypes definitions for component props
FirstNameInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  error: PropTypes.string, // Optional error message string
};

FirstNameInput.defaultProps = {
  error: "", // Default error message is an empty string
};

LastNameInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  error: PropTypes.string, // Optional error message string
};

LastNameInput.defaultProps = {
  error: "", // Default error message is an empty string
};

EmailInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  error: PropTypes.string, // Optional error message string
};

EmailInput.defaultProps = {
  error: "", // Default error message is an empty string
};

PhoneInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  error: PropTypes.string, // Optional error message string
};

PhoneInput.defaultProps = {
  error: "", // Default error message is an empty string
};

AddressInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  name: PropTypes.string.isRequired, // Name attribute for the input field
  error: PropTypes.string, // Optional error message string
};

AddressInput.defaultProps = {
  error: "", // Default error message is an empty string
};

ZipCodeInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  name: PropTypes.string.isRequired, // Name attribute for the input field
  error: PropTypes.string, // Optional error message string
};

ZipCodeInput.defaultProps = {
  error: "", // Default error message is an empty string
};

CityInput.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input field with React Hook Form
  name: PropTypes.string.isRequired, // Name attribute for the input field
  error: PropTypes.string, // Optional error message string
};

CityInput.defaultProps = {
  error: "", // Default error message is an empty string
};

AddressControl.propTypes = {
  register: PropTypes.func.isRequired, // Function to register the input fields with React Hook Form
  addressInputName: PropTypes.string.isRequired, // Name attribute for the address input field
  zipCodeInputName: PropTypes.string.isRequired, // Name attribute for the zip code input field
  cityInputName: PropTypes.string.isRequired, // Name attribute for the city input field
  errors: PropTypes.instanceOf(Object), // Object containing validation errors
};

AddressControl.defaultProps = {
  errors: {}, // Default value for errors is an empty object
};

CustomerInformation.propTypes = {
  customerDetails: PropTypes.instanceOf(Object), // Object containing customer details
  onUpdateCustomerDetails: PropTypes.func, // Function to update customer details
  offerRequest: PropTypes.instanceOf(Object), // Object containing offer request details
  onUpdateOfferRequest: PropTypes.func, // Function to update offer request details
  apiError: PropTypes.oneOfType([
    PropTypes.instanceOf(Array), // Either an array or object containing API errors
    PropTypes.instanceOf(Object),
  ]).isRequired, // Required API error(s)
};

CustomerInformation.defaultProps = {
  customerDetails: {}, // Default customer details are an empty object
  onUpdateCustomerDetails: () => {}, // Default update function is a no-op function
  offerRequest: {}, // Default offer request details are an empty object
  onUpdateOfferRequest: () => {}, // Default update function is a no-op function
};

IsTargetInstallationAddressDifferent.propTypes = {
  value: PropTypes.bool.isRequired, // Boolean value indicating the state of the toggle switch
  setValue: PropTypes.func.isRequired, // Function to set the toggle switch value
};

export default CustomerInformation;
