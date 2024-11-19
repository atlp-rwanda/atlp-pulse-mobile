import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";
import { useMutation, gql } from "@apollo/client";
import { LOGIN_MUTATION} from '@/graphql/mutations/login.mutation';
import { LOGIN_WITH_2FA} from '@/graphql/mutations/two-factor.mutation';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';


const TwoFactorScreen = () => {
  const [input, setInput] = useState<string[]>(Array(6).fill(""));
  const [userEmail, setuserEmail] = useState<string>('');
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(30);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const inputRefs = useRef<TextInput[]>([]);
  const params = useLocalSearchParams<{ redirect?: string; logout: string }>();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("user_email");
        if (email) {
          setuserEmail(email); 
        }
      } catch (error) {
        toast.show(`Failed to fetch email from storage`, {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    };

    fetchUserEmail();
  }, []);

  const resetTimer = () => {
    setCountdown(30);
    setIsTimerActive(true);
  };

  const [loginWithTwoFactorAuthentication] = useMutation(LOGIN_WITH_2FA, {
    onCompleted: async (data) => {
      const response = data.loginWithTwoFactorAuthentication;
      const token = response.token;
      if (response.user.role === 'trainee') {
        await AsyncStorage.setItem('authToken', token);

        while (router.canGoBack()) {
          router.back();
        }
        
        params.redirect
          ? router.push(`${params.redirect}` as Href<string | object>)
          : router.push('/dashboard');
        return;
      } else {
        toast.show(t('toasts.auth.loginErr'), {
          type: 'danger',
        });
        return;
      }
    },
    onError: (error) => {
      setLoading(false)
      setError(error.message || "Verification Failed");
      toast.show(`Verification Failed: ${error.message}`, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      setInput(Array(6).fill(""));
    },
  });

  const [LoginUser] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      setResending(false);
      toast.show(t('toasts.two-factor.Code-resent-successfully'), {
        type: 'success',
        placement: 'top',
        duration: 4000,
      });
      resetTimer(); 
    },
    onError: (error) => {
      setResending(false);
      toast.show(t('toasts.two-factor.Failed-to-resend-code'), {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      });
    },
  });


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [countdown, isTimerActive]);

  const handleResendOTP = async () => {
    if (resending || isTimerActive) return;
    
    try {
      setResending(true);
      const email = await AsyncStorage.getItem('user_email');
      const password = await AsyncStorage.getItem('userpassword');
      const orgToken = await AsyncStorage.getItem('orgToken');
      const loginInput = {
        email: email,
        password: password,
        orgToken: orgToken,
      };
      if (email && password) {
        await LoginUser({
          variables: {
            loginInput,
          },
        });
      }
    } catch (error) {
      setResending(false);
      toast.show(t('toasts.two-factor.Failed-to-resend-code'), {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      });
    }
  };

  const verifyOtp = async () => {
    const email = await AsyncStorage.getItem('user_email');

    if (input.some((val) => !val)) {
      setError("Please enter all digits");
      return;
    }

    setLoading(true);

    try {
      await loginWithTwoFactorAuthentication({
        variables: {
          email,
          otp: input.join("")
        },
      });
      setLoading(false)
    } catch {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
  
    if (value.length === 6) {
      const newInput = value.split("").slice(0, 6);
      setInput(newInput);
      inputRefs.current[5]?.focus();
    } else {
      const newInput = [...input];
      newInput[index] = value;
      setInput(newInput);
  
      if (value && index < input.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  

  const handleBackspace = (index: number, value: string) => {
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  

  return (
    <KeyboardAvoidingView className="h-full mx-5 flex flex-col justify-top items-center">
      <View className={`w-full h-fit mt-16 bg-white dark:bg-gray-800 rounded-lg p-6 shadow ${colorScheme === "dark" ? "bg-gray-100" : "dark:bg-gray-900"}`}>
        <Text className={`text-center text-2xl font-Inter-Bold ${colorScheme === "dark" ? "text-gray-100" : "text-gray-800"}`}>{t('toasts.two-factor.verficationtitle1')}</Text>
        <Text className={`text-center font-Inter-Bold text-lg ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"} mt-2`}>{t('toasts.two-factor.verficationtitle2')}</Text>
        <Text className={`text-center font-bold mt-1 ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{userEmail}</Text>
        
        <View className="flex-row justify-between mt-6 items-center gap-3">
          {input.map((value, index) => (
            <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el!)}
            value={value}
            maxLength={6}
            keyboardType="numeric"
            onChangeText={(val) => handleInputChange(index, val)}
            onKeyPress={({ nativeEvent }) =>
              nativeEvent.key === "Backspace" && handleBackspace(index, value)
            }
            className={`w-10 h-10 text-center text-lg font-semibold border ${
              colorScheme === "dark"
                ? "bg-gray-700 text-gray-100 border-gray-600"
                : "bg-white text-gray-800"
            } rounded`}
          />
          ))}
        </View>

        <TouchableOpacity
          onPress={verifyOtp}
          disabled={loading || input.some((val) => !val)}
          className={`mt-6 py-3 px-4 rounded ${loading || input.some((val) => !val) ? "bg-gray-400" : "bg-[#8667F2]"}`}
        >
          <Text className="text-center text-white">{loading ? t('toasts.two-factor.Verifying') : t('toasts.two-factor.Verify-Code')}</Text>
        </TouchableOpacity>

        <View className="mt-4 flex items-center justify-center">
          {isTimerActive ? (
            <Text className={`text-center ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {t('toasts.two-factor.Resend-code-in')} {countdown}s
            </Text>
          ) : (
            <TouchableOpacity 
              onPress={handleResendOTP}
              disabled={resending}
            >
              <Text className="text-center text-[#8667F2] font-semibold">
                {resending ? t('toasts.two-factor.Sending') : t('toasts.two-factor.Resend-Code')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TwoFactorScreen;