import * as Yup from 'yup';

export const PasswordResetSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Your current password is required'),

  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .required('Your new password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});
