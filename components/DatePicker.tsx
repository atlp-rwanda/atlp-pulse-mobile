import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import DefaultDatePicker from 'react-native-date-picker';
import { Text, View } from './Themed';
import Button from './buttons';

type DatePickerProps = {
  onSubmit: (date: Date) => void;
  initialDate?: Date | null;
  placeholder?: string;
};

export default function DatePicker({
  onSubmit,
  initialDate,
  placeholder = 'Date',
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(initialDate ?? new Date());
  const [dateSelected, setDateSelected] = useState(initialDate != null);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <View className="flex-row items-center px-3 py-0 rounded-lg border border-gray-300 shadow shadow-gray-50 bg-primary-light">
      <Ionicons name="calendar" size={20} color="gray" className="mr-2" />
      <Text className="flex-1 ml-2">{dateSelected ? formatDate(date) : placeholder}</Text>
      <Button
        title="Select Date"
        size="sm"
        className="px-3 bg-transparent"
        onPress={() => {
          setOpen(true);
        }}
      />
      <DefaultDatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          setDateSelected(true);
          onSubmit(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}
