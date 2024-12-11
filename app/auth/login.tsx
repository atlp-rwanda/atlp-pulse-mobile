import OrgLogin from '@/components/Login/OrgLogin';
import UserLogin from '@/components/Login/UserLogin';
import { LOGIN_MUTATION, ORG_LOGIN_MUTATION } from '@/graphql/mutations/login.mutation';
import { ApolloError, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';

export default function SignInOrganization() {
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const [orgLoginSuccess, setOrgLoginSuccess] = useState(false);
  const [orgLoginMutation] = useMutation(ORG_LOGIN_MUTATION);
  const [LoginUser] = useMutation(LOGIN_MUTATION);
  const params = useLocalSearchParams<{ redirect?: string }>();

  const onOrgSubmit = async (values: any) => {
    try {
      await orgLoginMutation({
        variables: {
          orgInput: {
            name: values.organization,
          },
        },
        onCompleted({ loginOrg }) {
          AsyncStorage.setItem('orgToken', loginOrg.token);
          let value: string = String(values.organization);
          AsyncStorage.setItem('orgName', value);
          toast.show(t('toasts.auth.logSuccess'), {
            type: 'success',
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
          });
          setOrgLoginSuccess(true);
        },
        onError(err: any) {
          toast.show(err.message, {
            type: 'fail',
            placement: 'top',
            duration: 5000,
            animationType: 'slide-in',
            style: { backgroundColor: 'red' },
          });
        },
      });
    } catch (err: any) {
      toast.show(t('toasts.auth.generalError'), { type: 'danger' });
    }
  };

  const onSubmit = async (userInput: any) => {
    try {
      const orgToken = await AsyncStorage.getItem('orgToken');
      userInput.orgToken = orgToken;
      await AsyncStorage.setItem('user_email', userInput.email);

      await LoginUser({
        variables: {
          loginInput: userInput,
        },
        onCompleted: async (data) => {
          if (data.addMemberToCohort) {
            toast.show(`${data.addMemberToCohort}`, { type: 'danger' });
            return;
          }

          if (data.loginUser && !data.loginUser.otpRequired) {
            const token = data.loginUser.token;

            if (data.loginUser.user.role === 'trainee') {
              await AsyncStorage.setItem('authToken', token);

              router.canDismiss() && router.dismissAll();
              params.redirect
                ? router.replace(`${params.redirect}` as RelativePathString)
                : router.replace('/dashboard');
              return;
            } else {
              toast.show(t('toasts.auth.loginErr'), {
                type: 'danger',
              });
              return;
            }

          }
          else if(data.loginUser.otpRequired)
            {
              await AsyncStorage.setItem('userpassword', userInput.password);
              router.push('/auth/two-factor')
              return
            }
          else {
            await AsyncStorage.setItem('authToken', data.loginUser.token);
            router.replace('/dashboard');
          }
        },
        onError: (err) => {
          if (err.networkError) {
            toast.show(t('toasts.auth.networkError'), { type: 'danger' });
          } else if (err.message.toLowerCase() === 'invalid credential') {
            toast.show(t('toasts.auth.invalidCredentials'), { type: 'danger' });
          } else if (err instanceof ApolloError) {
            toast.show(err.message, { type: 'danger' });
          }
        },
      });
    } catch (error: any) {
      toast.show(t('toasts.auth.generalError'), { type: 'danger' });
    }
  };

  return orgLoginSuccess ? <UserLogin onSubmit={onSubmit} /> : <OrgLogin onSubmit={onOrgSubmit} />;
}
