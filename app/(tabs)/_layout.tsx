import React, { PropsWithChildren } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import client from '@/graphql/client'
import { ApolloProvider } from '@apollo/client';

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  testID?: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export const CustomText: React.FC<PropsWithChildren> = ({ children }) => <Text>{children}</Text>;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={client}>
          <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} testID="tabOneIcon" />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable testID="headerRightButton">
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} testID="tabTwoIcon" />,
        }}
      />
    </Tabs>
    </ApolloProvider>

  );
}