import DatePicker from '@/components/DatePicker';
import { DarkBottomIcon, LightBottomIcon } from '@/components/icons/auth/icons';
import { Text, View } from '@/components/Themed';
import { SIGN_UP_MUTATION } from '@/graphql/mutations/register.mutation';
import { RegisterSchema } from '@/validations/register.schema';
import { ApolloError, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

type FormValues = {
  firstName: string;
  lastName: string;
  password: string;
  gender: string;
  dob: string;
};

type TokenPayload = {
  name: string;
  email: string;
  exp: number;
};

type RegisterResponse = {
  createUser: {
    token: string;
  };
};

export default function RegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();

  let { token } = params as { token: string };

  token = Array.isArray(token) ? token.join('.') : token?.replace(/\*/g, '.');

  const [loading, setLoading] = useState(false);
  const [TCAccepted, setTCAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [SignupUser] = useMutation<RegisterResponse>(SIGN_UP_MUTATION);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authToken = await AsyncStorage.getItem('org_token');
      if (authToken) {
        try {
          const parsedToken = jwtDecode<TokenPayload>(authToken);
          if (parsedToken.exp < Date.now()) {
            await AsyncStorage.removeItem('org_token');
          } else {
            router.push('/dashboard/trainee');
          }
        } catch (err) {
          toast.show('Invalid token or expired token', { type: 'danger' });
        }
      }
    };

    checkAuthStatus();
  }, [router]);

  const formik = useFormik<FormValues>({
    initialValues: {} as FormValues,
    onSubmit: async (values: FormValues) => {
      setLoading(true);
      try {
        const { data, errors } = await SignupUser({
          variables: {
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dob,
            gender: values.gender,
            email: email,
            password: values.password,
            orgToken: token,
          },
        });

        if (data) {
          toast.show('Successfully registered', { type: 'success' });
          await AsyncStorage.setItem('org_token', data.createUser.token);
          router.push('/auth/login');
        }

        if (errors) {
          toast.show(errors[0].message, { type: 'danger' });
        }
      } catch (error) {
        if (error instanceof ApolloError) {
          toast.show(`Error: ${error.message}`, { type: 'danger' });
        } else {
          toast.show(`Error: Unknown error`, { type: 'danger' });
        }
      }
      setLoading(false);
    },
    validationSchema: RegisterSchema,
  });

  useEffect(() => {
    try {
      if (token != null) {
        const parsedToken = jwtDecode<TokenPayload>(token);
        setEmail(parsedToken.email);
        setOrgName(parsedToken.name);
      }
    } catch (err) {
      toast.show('Invalid token or expired token', { type: 'danger' });
    }
  }, []);

  return (
    <View className="flex-1 p-8 justify-center">
      <View className="mb-8">
        <Text className="text-xl font-Inter-SemiBold text-center text-gray-800 dark:text-gray-200 mb-3">
          Register Your Account!
        </Text>
        <Text className="font-Inter-Regular text-center text-gray-800 dark:text-gray-200">
          Fill in your information to join {orgName}
        </Text>
      </View>

      <View className="flex flex-col">
        <View>
          <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium">First Name:</Text>
          <View
            className={`flex-row items-center px-3 py-2.5 rounded-lg border border-gray-300 shadow shadow-gray-50 bg-primary-light`}
          >
            <Ionicons name="person" size={20} color="gray" className="mr-2" />

            <TextInput
              testID="first-name"
              placeholder="First Name"
              onChangeText={formik.handleChange('firstName')}
              value={formik.values.firstName}
              style={{ flex: 1 }}
              autoCapitalize="none"
              className={`ml-2`}
            />
          </View>
          <Text className="text-error-500 my-1">{formik.errors.firstName}</Text>
        </View>
        <View>
          <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium">Last Name:</Text>
          <View
            className={`flex-row items-center px-3 py-2.5 rounded-lg border border-gray-300 shadow shadow-gray-50 bg-primary-light`}
          >
            <Ionicons name="person" size={20} color="gray" className="mr-2" />

            <TextInput
              testID="last-name"
              placeholder="Last Name"
              onChangeText={formik.handleChange('lastName')}
              value={formik.values.lastName}
              style={{ flex: 1 }}
              autoCapitalize="none"
              className={`ml-2`}
            />
          </View>
          <Text className="text-error-500 my-1">{formik.errors.lastName}</Text>
        </View>
        <View>
          <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium">Email:</Text>
          <View
            className={`flex-row items-center px-3 py-2.5 rounded-lg border border-gray-300 shadow shadow-gray-50 bg-primary-light mb-8`}
          >
            <Ionicons name="mail" size={20} color="gray" className="mr-2" />

            <TextInput
              testID="email"
              placeholder="Email"
              value={email!}
              style={{ flex: 1 }}
              autoCapitalize="none"
              className={`ml-2 text-gray-800 dark:text-gray-200`}
              editable={false}
            />
          </View>
        </View>

        <View>
          <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium">Gender:</Text>
          <View className="flex flex-row items-center justify-center px-3 py-1.5 rounded-lg border border-gray-300 shadow shadow-gray-50 bg-primary-light">
            <Ionicons name="female" size={20} color="gray" />
            <View className="flex-1">
              <Picker
                style={{ height: 35 }}
                selectedValue={formik.values.gender}
                onValueChange={(value: string) => {
                  formik.setFieldValue('gender', value);
                }}
              >
                <Picker.Item label="Select Gender" value="" enabled={false} />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>
          <Text className="text-error-500 my-1">{formik.errors.gender}</Text>
        </View>

        <View>
          <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium">Date of Birth:</Text>
          <DatePicker
            placeholder="Date of Birth"
            onSubmit={(date: Date) => {
              formik.setFieldValue('dob', date);
            }}
          />
          <Text className="text-error-500 my-1">{formik.errors.dob}</Text>
        </View>

        <View>
          <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium">Password:</Text>
          <View
            className={`flex-row items-center px-3 py-2.5 rounded-lg border border-gray-300 shadow shadow-gray-50 bg-primary-light`}
          >
            <Ionicons name="person" size={20} color="gray" className="mr-2" />

            <TextInput
              testID="password"
              placeholder="Password"
              onChangeText={formik.handleChange('password')}
              value={formik.values.password}
              style={{ flex: 1 }}
              autoCapitalize="none"
              className={`ml-2`}
              secureTextEntry={!showPassword}
            />
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
              className="mx-2"
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            />
          </View>
          <Text className="text-error-500 my-1">{formik.errors.password}</Text>
        </View>

        <View className="flex flex-col gap-4 mt-2">
          <View className="mt-2 flex-row ml-2">
            <Checkbox
              className="w-4 h-4 rounded border border-gray-300"
              value={TCAccepted}
              onValueChange={setTCAccepted}
              color={TCAccepted ? '#8667F2' : undefined}
            />
            <Text className="ml-2 text-gray-800 dark:text-white">
              I agree to <Text className="text-action-600">the Terms & Conditions</Text> of Pulse
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!TCAccepted) {
                Alert.alert('Warning', 'Please accept terms and conditions');
                return;
              }
              formik.handleSubmit();
            }}
            className="bg-action-500 p-4 rounded-lg items-center mt-4"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className={`text-white text-lg`}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-6 flex-row">
          <Text className="ml-2">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')} className="ml-2 ">
            <Text className={`underline`}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center">
        <SvgXml xml={colorScheme === 'dark' ? DarkBottomIcon : LightBottomIcon} />
      </View>
    </View>
  );
}
