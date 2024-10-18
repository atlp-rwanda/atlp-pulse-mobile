import i18n from '@/internationalization';
import * as Yup from 'yup';

export const UserLoginSchema = Yup.object().shape({
  email: Yup.string().email(i18n.t('userLogin.email_invalid')).required(i18n.t('userLogin.email_required')),
  password: Yup.string()
    .min(8, i18n.t('userLogin.password_min'))
    .required(i18n.t('userLogin.password_required')),
});
export const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email(i18n.t('userLogin.email_invalid')).required(i18n.t('userLogin.email_required')),
});
export const OrgLoginSchema = Yup.object().shape({
  organization: Yup.string().required(i18n.t('userLogin.organization_required')),
});
export const SetNewPasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, i18n.t('userLogin.password_min')).required(i18n.t('userLogin.password_required')),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password')], i18n.t('userLogin.passwords_must_match'))
    .required(i18n.t('userLogin.confirm_password_required')),
});
