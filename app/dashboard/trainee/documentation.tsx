import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GET_DOCUMENTATIONS } from '../../../graphql/queries/documentation.query';
import { useQuery } from '@apollo/client';
import { ActivityIndicator } from 'react-native';

interface SubDocument {
  title: string;
  description: string;
}

interface Documentation {
  id: string;
  title: string;
  for: string;
  description: string;
  subDocuments: SubDocument[];
}

const DocumentationComponent = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  const { data, loading, error } = useQuery<{ getDocumentations: Documentation[] }>(GET_DOCUMENTATIONS);

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor}`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor}`}>
        <Text className={textColor}>Error loading documentation: {error.message}</Text>
      </View>
    );
  }

  const documentations = data?.getDocumentations || [];

  const renderSubDocuments = (subDocs: SubDocument[]) => {
    return subDocs.map((subDoc, index) => (
      <View key={index} className="ml-4 mb-4">
        <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
          {subDoc.title}
        </Text>
        <Text className={`mb-2 text-lg ${textColor}`}>
          {subDoc.description}
        </Text>
      </View>
    ));
  };

  return (
    <ScrollView className={`flex p-4 ${bgColor}`}>
      <Text className={`text-2xl font-bold text-center mb-6 ${textColor}`}>
        {t('documentation.pageTitle')}
      </Text>
      
      {documentations.map((doc, index) => (
        <View key={doc.id || index} className="mb-8 border-b border-gray-300 pb-4">
          <Text className={`text-xl font-semibold mb-4 text-action-500`}>
            {doc.title}
          </Text>
          
          <View className="ml-4">
            <Text className={`mb-4 text-lg ${textColor}`}>
              {doc.description}
            </Text>

            {doc.subDocuments && doc.subDocuments.length > 0 && (
              <View className="mt-4">
                {renderSubDocuments(doc.subDocuments)}
              </View>
            )}
          </View>
        </View>
      ))}

      {(!documentations || documentations.length === 0) && (
        <>
          <View className="mb-8 border-b border-gray-300 pb-4">
            <Text className={`text-xl font-semibold mb-4 text-action-500`}>
              {t('documentation.gettingStarted.title')}
            </Text>
            <View>
              <Text className={`mb-4 text-lg ${textColor}`}>
                {t('documentation.gettingStarted.intro')}
              </Text>

              <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
                {t('documentation.gettingStarted.terminologyTitle')}
              </Text>
              <View className="ml-4 mb-4">
                {Object.entries({
                  organizations: true,
                  programs: true,
                  managers: true,
                  trainees: true,
                }).map(([key]) => (
                  <Text key={key} className={`mb-2 text-lg ${textColor}`}>
                    <Text className={`font-bold ${textColor}`}>
                      {t(`documentation.gettingStarted.terms.${key}.bullet`)}
                    </Text>
                    {t(`documentation.gettingStarted.terms.${key}.description`)}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className="mb-8 border-b border-gray-300 pb-4">
            <Text className={`text-xl font-semibold mb-4 text-action-500`}>
              {t('documentation.login.title')}
            </Text>
            <View className="ml-4">
              <Text className={`mb-4 text-lg ${textColor}`}>
                {t('documentation.login.intro')}
              </Text>
              <Text className={`mb-4 ${textColor} text-lg`}>
                {t('documentation.login.welcome')}
              </Text>
              
              <Text className={`mb-2 font-semibold text-lg ${textColor}`}>
                {t('documentation.login.stepsTitle')}
              </Text>

              <View className="ml-4 mb-4 flex gap-4">
                {[1, 3, 5, 7, 9, 11].map((num) => (
                  <Text key={num}>
                    <Text className={`mb-2 text-lg font-bold ${textColor}`}>
                      {t(`documentation.login.steps.step${num}`)}:{' '}
                    </Text>
                    <Text className={`mb-2 text-lg ${textColor}`}>
                      {t(`documentation.login.steps.step${num + 1}`)}
                    </Text>
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default DocumentationComponent;