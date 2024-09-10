import Button from '@/components/buttons';
import { Text, View } from '@/components/Themed';
import { LoginSchema } from '@/validations';
import { useFormik } from 'formik';
import React from 'react';
import { TextInput } from 'react-native';

export default function App() {
  const initialValues = {
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => console.log('Validated values: ', values),
    validationSchema: LoginSchema,
  });

  return (
    <View className="p-6">
      <View className="my-2">
        <TextInput
          className="p-4 border border-gray-400 text-gray-800 text-lg dark:text-gray-100 rounded-lg"
          value={formik.values.email}
          placeholder="Email"
          onChangeText={formik.handleChange('email')}
        />
        <Text className="mt-2 text-error-400 ">{formik.errors.email}</Text>
      </View>
      <View className="my-2">
        <TextInput
          className="p-4 border border-gray-400 text-gray-800 text-lg dark:text-gray-100 rounded-lg"
          value={formik.values.password}
          placeholder="Password"
          secureTextEntry
          onChangeText={formik.handleChange('password')}
        />
        <Text className="mt-2 text-error-400">{formik.errors.password}</Text>
      </View>
      <Button className="my-6" onPress={formik.handleSubmit} title="Submit" />
    </View>
  );
}
