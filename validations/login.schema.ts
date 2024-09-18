import * as Yup from 'yup';

export const UserLoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
});

export const OrgLoginSchema = Yup.object().shape({
  organization: Yup.string().required('Organization URL is required'),
});
