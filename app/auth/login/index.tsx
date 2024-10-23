import { ConstantId } from '@/AppManager';
import OrgLogin from '@/components/Login/OrgLogin';
import UserLogin from '@/components/Login/UserLogin';
import { LOGIN_MUTATION, ORG_LOGIN_MUTATION } from '@/graphql/mutations/login.mutation';
import { UserContext } from '@/hooks/useAuth';
import { useApolloClient, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

class ErrorHandler {
  static handleNetworkError() {
    ToastAndroid.show('There was a problem contacting the server', ToastAndroid.LONG);
  }

  static handleInvalidCredentials() {
    Alert.alert('Error', 'Invalid credentials');
  }

  static handleCustomError(message: string | undefined) {
    Alert.alert('Error', message);
  }

  static handleGeneralError() {
    Alert.alert('Error', 'An unexpected error occurred.');
  }
}

export default function SignInOrganization() {
  const router = useRouter();
  const toast = useToast();
  const [orgLoginSuccess, setOrgLoginSuccess] = useState(false);
  const [orgLoginMutation] = useMutation(ORG_LOGIN_MUTATION);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext) || {};
  const [LoginUser] = useMutation(LOGIN_MUTATION);
  const client = useApolloClient();
  const [name, setName] = useState('');
  const params = useLocalSearchParams<{ redirect?: string }>();
  const onOrgSubmit = async (values: any) => {
    setName(values);
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
          ErrorHandler.handleCustomError(`${err}`);
        },
      });
    } catch (err: any) {
      ErrorHandler.handleGeneralError();
    }
  };

  const onSubmit = async (userInput: any) => {
    try {
      const orgToken = await AsyncStorage.getItem('orgToken');
      userInput.orgToken = orgToken;
      setLoading(true);

      await LoginUser({
        variables: {
          loginInput: userInput,
        },
        onCompleted: async (data) => {
          if (data.addMemberToCohort) {
            ToastAndroid.show(`${data.addMemberToCohort}`, ToastAndroid.LONG);
          }

          if (login && data.loginUser) {
            const token = data.loginUser.token;

            if (data.loginUser.user.role === 'trainee') {
              params.redirect
                ? router.push(`${params.redirect}` as Href<string | object>)
                : router.push('/dashboard' as Href<string | object>);
            }

            try {
              await AsyncStorage.setItem('auth_token', token);
              const storedToken = await AsyncStorage.getItem('auth_token');

              if (storedToken !== token) {
                console.error('Stored token does not match received token');
              }
            } catch (error) {
              console.error('Error storing token:', error);
            }
            login(data.loginUser);
            try {
              await client.resetStore();
            } catch (error) {
              console.error('Error resetting client store:', error);
            }

            // Handle redirection
            if (params.redirect) {
              router.push(params.redirect);
              return;
            }

            // Navigate based on user role
            const role = data.loginUser.user.role;
            if (role === 'admin' || role === 'coordinator') {
              await AsyncStorage.setItem('authToken', data.loginUser.token);
              router.push('/dashboard/trainee');
            } else {
              Alert.alert('The app is for the trainee only');
            }
          } else {
            await AsyncStorage.setItem('authToken', data.loginUser.token);
            router.push('/dashboard');
          }
        },
        onError: (err) => {
          if (err.networkError) {
            ErrorHandler.handleNetworkError();
          } else if (err.message.toLowerCase() === 'invalid credential') {
            ErrorHandler.handleInvalidCredentials();
          } else {
            const translateError = 'Please wait to be added to a program or cohort';
            ErrorHandler.handleCustomError(translateError);
          }
        },
      });
    } catch (error: any) {
      ErrorHandler.handleGeneralError();
    } finally {
      setLoading(false);
    }
  };

  return orgLoginSuccess ? <UserLogin onSubmit={onSubmit} /> : <OrgLogin onSubmit={onOrgSubmit} />;
}
