import * as Yup from 'yup';

export const UserLoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please provide your email address'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Please provide a password'),
});
export const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required(' Email is Required'),
});
export const OrgLoginSchema = Yup.object().shape({
  organization: Yup.string().required('Organization URL is required'),
});
export const SetNewPasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, 'Password must be at least 8 characters').required(' Password is Required'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});
