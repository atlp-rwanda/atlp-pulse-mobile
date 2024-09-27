import * as Yup from 'yup';

const today = new Date();
const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

export const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[A-Za-z]+$/, 'First name must be characters only')
    .required('Please provide your first name'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[A-Za-z]+$/, 'Last name must be characters only')
    .required('Please provide your last name'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please provide a password'),
  gender: Yup.string().oneOf(['Male', 'Female']).required('Please select your gender'),
  dob: Yup.date()
    .max(sixteenYearsAgo, 'You must be 16 years old and above')
    .required('Please select date of birth'),
});
