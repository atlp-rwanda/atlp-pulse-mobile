import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

const DocumentationComponent = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  const documentationSections = [
    {
      title: t('documentation.gettingStarted.title'),
      content: (
        <View>
          <Text className={`mb-4 text-lg ${textColor}`}>
            {t('documentation.gettingStarted.intro')}
          </Text>

          <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
            {t('documentation.gettingStarted.terminologyTitle')}
          </Text>
          <View className="ml-4 mb-4">
            <Text className={`mb-2 text-lg ${textColor}`}>
              <Text className={`mb-2 text-lg font-bold ${textColor}`}>
                {t('documentation.gettingStarted.terms.organizations.bullet')}
              </Text>
              {t('documentation.gettingStarted.terms.organizations.description')}
            </Text>
            <Text className={`mb-2 text-lg ${textColor}`}>
              <Text className={`mb-2 text-lg font-bold ${textColor}`}>
                {t('documentation.gettingStarted.terms.programs.bullet')}
              </Text>
              {t('documentation.gettingStarted.terms.programs.description')}
            </Text>
            <Text className={`mb-2 text-lg ${textColor}`}>
              <Text className={`mb-2 text-lg font-bold ${textColor}`}>
                {t('documentation.gettingStarted.terms.managers.bullet')}
              </Text>
              {t('documentation.gettingStarted.terms.managers.description')}
            </Text>
            <Text className={`mb-2 text-lg ${textColor}`}>
              <Text className={`mb-2 text-lg font-bold ${textColor}`}>
                {t('documentation.gettingStarted.terms.trainees.bullet')}
              </Text>
              {t('documentation.gettingStarted.terms.trainees.description')}
            </Text>
          </View>

          <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
            {t('documentation.gettingStarted.signupTitle')}
          </Text>
          <Text className={`mb-4 text-lg ${textColor}`}>
            {t('documentation.gettingStarted.signupDescription')}
          </Text>

          <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
            {t('documentation.gettingStarted.signinTitle')}
          </Text>
          <Text className={`mb-4 text-lg ${textColor}`}>
            {t('documentation.gettingStarted.signinDescription')}
          </Text>
        </View>
      ),
    },
    {
      title: t('documentation.login.title'),
      content: (
        <View className="ml-4">
          <Text className={`mb-4 text-lg ${textColor}`}>{t('documentation.login.intro')}</Text>
          <Text className={`mb-4 ${textColor} text-lg`}>{t('documentation.login.welcome')}</Text>

          <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
            {t('documentation.login.stepsTitle')}
          </Text>

          <View className="ml-4 mb-4">{/* ... Steps section ... */}</View>
          <Text className={`mb-2 text-lg font-bold ${textColor}`}>
            {t('documentation.login.footer')}
          </Text>
        </View>
      ),
    },
  ];

  return (
    <ScrollView className={`flex p-4 ${bgColor}`}>
      <Text className={`text-2xl font-bold text-center mb-6 ${textColor}`}>
        {t('documentation.pageTitle')}
      </Text>
      {documentationSections.map((section, index) => (
        <View key={index} className="mb-8 border-b border-gray-300 pb-4">
          <Text className={`text-xl font-semibold mb-4 text-action-500`}>{section.title}</Text>
          {section.content}
        </View>
      ))}
    </ScrollView>
  );
};

export default DocumentationComponent;
