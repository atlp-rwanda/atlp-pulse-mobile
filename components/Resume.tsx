import { UPLOAD_RESUME } from '@/graphql/mutations/Resume.mutations';
import { GET_TRAINEE_PROFILE } from '@/graphql/queries/user';
import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerResult } from 'expo-document-picker';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';

const Resume = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';
  const activebuttonbg = 'text-secondary-light bg-action-500';
  const inactivebuttonbg =
    colorScheme === 'dark' ? ' bg-secondary-dark-700' : ' bg-secondary-light-800';
  const [resumeFile, setResumeFile] = useState<DocumentPickerResult | null>(null);
  const [externalLink, setExternalLink] = useState('');
  const [isUploadPC, setIsUploadPC] = useState(true);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const toast = useToast();
  const [UploadResume, { loading }] = useMutation(UPLOAD_RESUME);
  const [fileLoading, setFileLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setUserToken(token);
        } else {
          toast.show(t('toasts.dashboard.tokenNotFound'), {
            type: 'danger',
            placement: 'top',
            duration: 3000,
          });
        }
      } catch (error) {
        toast.show('Failed to retrieve token.', {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    };
    fetchToken();
  }, []);

  interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
  }

  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(userToken as string);
        setUserId(decoded.userId);
      } catch (error) {
        toast.show(t('toasts.dashboard.failedToken'), {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    }
  }, [userToken]);

  const handleFilePick = async () => {
    setFileLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      const asset = result.assets?.[0];
      if (!asset?.uri || !asset?.mimeType || !asset?.name) {
        throw new Error('Invalid file selected: Missing required file properties');
      }
      if (result.assets?.[0]) {
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].name,
        } as any);
        formData.append('upload_preset', 'mydocs');
        formData.append('resource_type', 'raw');
        // @ts-ignore
        const response = await axios.post(
          process.env.RESUME_URL || 'https://api.cloudinary.com/v1_1/dta2axdpw/raw/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
            timeout: 20000,
          }
        );
        if (response.data?.secure_url) {
          setResumeFile(response.data.secure_url);
          setResumeName(response.data?.original_filename + '.pdf');
        } else {
          throw new Error('Upload successful but secure_url not received');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
        });
      } else {
        toast.show(`Upload error: ${error}`, { type: 'danger', placement: 'top', duration: 3000 });
      }
      throw error;
    }
    setFileLoading(false);
  };
  const handleUpload = async () => {
    if (isUploadPC) {
      if (resumeFile) {
        await UploadResume({
          context: {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
          variables: {
            userId: userId,
            resume: resumeFile,
          },
          update: (cache, { data }) => {
            try {
              const existingTraineeProfile: { getProfile: { resume: string } } | null =
                cache.readQuery({
                  query: GET_TRAINEE_PROFILE,
                });

              if (existingTraineeProfile) {
                cache.writeQuery({
                  query: GET_TRAINEE_PROFILE,
                  data: {
                    getProfile: {
                      ...existingTraineeProfile.getProfile,
                      resume: data.uploadResume.resume,
                    },
                  },
                });
              }
            } catch (e) {
              toast.show('GET_TRAINEE_PROFILE cache update failed.', {
                type: 'danger',
                placement: 'top',
                duration: 3000,
              });
            }
          },
          onCompleted: (data) => {
            toast.show('Resume uploaded successfully', {
              type: 'success',
              placement: 'top',
              duration: 3000,
            });
            setResumeName(null);
          },
          onError: (error) => {
            toast.show(error.message, { type: 'danger', placement: 'top', duration: 3000 });
          },
        });
      } else {
        toast.show('Please choose a file', { type: 'danger', placement: 'top', duration: 3000 });
      }
    } else {
      if (externalLink.trim()) {
        await UploadResume({
          context: {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
          variables: {
            userId: userId,
            resume: externalLink,
          },
          update: (cache, { data }) => {
            try {
              const existingTraineeProfile: { getProfile: { resume: string } } | null =
                cache.readQuery({
                  query: GET_TRAINEE_PROFILE,
                });

              if (existingTraineeProfile) {
                cache.writeQuery({
                  query: GET_TRAINEE_PROFILE,
                  data: {
                    getProfile: {
                      ...existingTraineeProfile.getProfile,
                      resume: data.uploadResume.resume,
                    },
                  },
                });
              }
            } catch (e) {
              toast.show('GET_TRAINEE_PROFILE cache update failed.', {
                type: 'danger',
                placement: 'top',
                duration: 3000,
              });
            }
          },
          onCompleted: (data) => {
            toast.show('Resume uploaded successfully', {
              type: 'success',
              placement: 'top',
              duration: 3000,
            });
            setExternalLink('');
          },
          onError: (error) => {
            toast.show(error.message, { type: 'danger', placement: 'top', duration: 3000 });
          },
        });
      } else {
        toast.show('Please enter a valid external link', {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    }
  };
  return (
    <ScrollView className={`flex bg-gray-900 ${bgColor} p-10`}>
      <View className="flex-row justify-between w-full mb-4">
        <TouchableOpacity
          className={`p-5 ${isUploadPC ? activebuttonbg : inactivebuttonbg} rounded-md`}
          onPress={() => setIsUploadPC(true)}
        >
          <Text className="text-white">Upload from Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`p-5 ml-2 ${!isUploadPC ? activebuttonbg : inactivebuttonbg} rounded-md`}
          onPress={() => setIsUploadPC(false)}
        >
          <Text className="text-white">Add external link</Text>
        </TouchableOpacity>
      </View>
      {isUploadPC ? (
        <View
          className={` w-full p-2  rounded-md  ${colorScheme === 'dark' ? 'text-primary-dark bg-secondary-dark-700' : 'bg-secondary-light-500'}`}
        >
          <Text className={`mb-4 ${textColor} text-lg`}>Upload resume from your Phone</Text>
          <View className={` items-start gap-1 `}>
            <TouchableOpacity
              className={`p-2 rounded-md mb-4 shadow border-1 border-secondary-dark-700  ${colorScheme === 'dark' ? 'bg-secondary-dark-500' : 'bg-secondary-light-800'}`}
              onPress={handleFilePick}
            >
              <Text className="text-white">
                {' '}
                {resumeName && resumeName ? resumeName : 'Choose File'}
              </Text>
              {fileLoading && <ActivityIndicator size="small" color="#fff" />}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center w-40 p-2 mb-4 rounded-md bg-action-500"
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text className={`text-white`}>Upload</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          className={` items-start gap-5 w-full p-2 ${colorScheme === 'dark' ? ' bg-secondary-dark-700' : 'bg-secondary-light-500'}  rounded-md`}
        >
          <Text className={`${textColor} text-lg`}>Upload resume from external link</Text>

          <TextInput
            className={`${textColor} ${colorScheme === 'dark' ? 'bg-secondary-dark-500' : 'bg-secondary-light-600'}  p-2 w-full rounded-md mb-4"`}
            placeholder="Enter external link"
            placeholderTextColor="#999"
            value={externalLink}
            onChangeText={setExternalLink}
          />

          <TouchableOpacity
            className="flex-row items-center justify-center w-40 p-2 mb-4 rounded-md bg-action-500"
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className={`text-white`}>Upload</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
export default Resume;
