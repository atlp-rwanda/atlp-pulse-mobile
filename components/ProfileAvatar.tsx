import { Image } from 'react-native';
import { Text, View } from './Themed';

type AvatarProps = {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
};

export default function ProfileAvatar({ name, size = 'md', src }: AvatarProps) {
  const sizeClass = {
    xs: 'w-11 h-11',
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  const textSizeClass = {
    xs: 'text-xl font-Inter-Medium',
    sm: 'text-2xl font-Inter-Medium',
    md: 'text-3xl font-Inter-Medium',
    lg: 'text-4xl font-Inter-Regular',
    xl: 'text-5xl font-Inter-Regular',
  };

  if (src) {
    return <Image source={{ uri: src }} className={`rounded-full ${sizeClass[size]}`} />;
  }

  const getInitials = (name?: string) => {
    if (!name) return 'UN';
    return name
      .trim()
      .toUpperCase()
      .split(' ')
      .filter((word) => word.length > 0)
      .slice(0, 2)
      .map((word) => word[0])
      .join('');
  };

  return (
    <View
      className={`p-0 rounded-full items-center justify-center bg-[#cbecd7] ${sizeClass[size]}`}
    >
      <View className={`rounded-full items-center justify-center bg-[#cbecd7] ${sizeClass[size]}`}>
        <Text className={`font-Inter-Regular ${textSizeClass[size]}`}>{getInitials(name)}</Text>
      </View>
    </View>
  );
}
