import OrgLogin from '@/components/Login/OrgLogin';
import UserLogin from '@/components/Login/UserLogin';
import { LOGIN_MUTATION, ORG_LOGIN_MUTATION } from '@/graphql/mutations/login.mutation';
import { ApolloError, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useToast } from 'react-native-toast-notifications';

export default function SignInOrganization() {
  const toast = useToast();
  const router = useRouter();
  const [orgLoginSuccess, setOrgLoginSuccess] = useState(false);
  const [orgLoginMutation] = useMutation(ORG_LOGIN_MUTATION);
  const [LoginUser] = useMutation(LOGIN_MUTATION);
  const params = useLocalSearchParams<{ redirect?: string; logout: string }>();

  useEffect(() => {
    if (params.logout == '1') {
      while (router.canGoBack()) {
        router.back();
      }
      router.replace('/auth/login');
    }
  }, []);

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
          toast.show('Welcome! Sign in to Continue', {
            type: 'success',
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
          });
          setOrgLoginSuccess(true);
        },
        onError(err: any) {
          if (err instanceof ApolloError) {
            toast.show(err.message, { type: 'danger' });
          } else {
            toast.show(err.message, { type: 'danger' });
          }
        },
      });
    } catch (err: any) {
      toast.show(`An unexpected error occurred: ${err.message}`, { type: 'danger' });
    }
  };

  const onSubmit = async (userInput: any) => {
    try {
      const orgToken = await AsyncStorage.getItem('orgToken');
      userInput.orgToken = orgToken;

      await LoginUser({
        variables: {
          loginInput: userInput,
        },
        onCompleted: async (data) => {
          if (data.addMemberToCohort) {
            toast.show(`${data.addMemberToCohort}`, { type: 'danger' });
            return;
          }

          if (data.loginUser) {
            const token = data.loginUser.token;

            if (data.loginUser.user.role === 'trainee') {
              await AsyncStorage.setItem('authToken', token);

              params.redirect
                ? router.push(`${params.redirect}` as Href<string | object>)
                : router.push('/dashboard');
              return;
            } else {
              toast.show('This app is for trainees only! Login through the web', {
                type: 'danger',
              });
              return;
            }
          }
        },
        onError: (err) => {
          if (err.networkError) {
            toast.show('There was a problem contacting the server', { type: 'danger' });
          } else if (err.message.toLowerCase() === 'invalid credential') {
            toast.show('Invalid credentials', { type: 'danger' });
          } else if (err instanceof ApolloError) {
            toast.show(err.message, { type: 'danger' });
          }
        },
      });
    } catch (error: any) {
      toast.show(`An unexpected error occurred: ${error.message}`, { type: 'danger' });
    }
  };

  return orgLoginSuccess ? <UserLogin onSubmit={onSubmit} /> : <OrgLogin onSubmit={onOrgSubmit} />;
}
