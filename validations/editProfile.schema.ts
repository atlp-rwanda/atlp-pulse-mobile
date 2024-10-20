import * as Yup from "yup";

export const EditProfileSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'First name must be at least 2 characters')
      .matches(/^[A-Za-z]+$/, 'First name must be characters only')
      .required('Please provide your first name'),
    lastName: Yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .matches(/^[A-Za-z]+$/, 'Last name must be characters only')
      .required('Please provide your last name'),
    });