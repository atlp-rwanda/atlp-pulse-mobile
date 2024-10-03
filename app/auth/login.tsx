import OrgLogin from '@/components/Login/OrgLogin';
import UserLogin from '@/components/Login/UserLogin';
import { LOGIN_MUTATION, ORG_LOGIN_MUTATION } from '@/graphql/mutations/login.mutation';
import { UserContext } from '@/hooks/useAuth';
import { useApolloClient, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';

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
          let value: string = String(name);
          value = `${name}`;
          AsyncStorage.setItem('orgName', value);
          Alert.alert('Welcome! Sign in to Continue');
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
            login(data.loginUser);
            await client.resetStore();
            Alert.alert('Welcome');

            if (params.redirect) {
              router.push(params.redirect as Href<string | object>);
              return;
            }
            await AsyncStorage.setItem('authToken', data.loginUser.token);
            const role = data.loginUser.user.role;
            if (role === 'admin' || role === 'coordinator') {
              router.push('/dashboard/trainee');
            } else {
              Alert.alert('The app is for the trainee only');
            }
          } else {
            router.push('/dashboard');
          }
        },
        onError: (err) => {
          if (err.networkError) {
            ErrorHandler.handleNetworkError();
          } else if (err.message.toLowerCase() === 'invalid credential') {
            ErrorHandler.handleInvalidCredentials();
          } else {
            // Only show this message for unexpected errors
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
