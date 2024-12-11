import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

interface DataPaginationProps {
  pageOptions: number[];
  columnLength: number;
  canNextPage: boolean;
  totalPages: number;
  canPreviousPage: boolean;
  pageSize: number;
  setPageSize: (size: number) => void;
  gotoPage: (page: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  pageIndex: number;
}

export default function DataPagination({
  pageOptions,
  columnLength,
  canNextPage,
  canPreviousPage,
  pageSize,
  setPageSize,
  gotoPage,
  previousPage,
  nextPage,
  pageIndex,
}: DataPaginationProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const pageSizes = [3, 5, 10, 25, 50, 100];

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setSelectedPageSize(size);
    setDropdownOpen(false);
  };

  const effectivePageCount = columnLength === 0 ? 1 : pageOptions.length;

  return (
    <View className="w-fit items-center mt-2">
      {pageOptions.length >= 0 && (
        <View className="w-fit mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <View className="flex flex-row justify-start items-center">
            <View className="flex-row items-center gap-4 w-32">
              <TouchableOpacity
                onPress={previousPage}
                disabled={!canPreviousPage}
                className="rounded-lg bg-[#9e85f5] border border-[#fff]"
              >
                <Icon name="arrow-left" size={42} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={nextPage}
                disabled={!canNextPage}
                className="rounded-lg bg-[#9e85f5] border border-[#fff]"
              >
                <Icon name="arrow-right" size={42} color="white" />
              </TouchableOpacity>
            </View>

            <View className="p-2 w-26">
              <Text className="text-gray-900 dark:text-white">
                {t('tickets.page')} {columnLength === 0 ? 1 : pageIndex + 1} of {effectivePageCount}
              </Text>
            </View>

            <View className="relative">
              <TouchableOpacity
                onPress={() => setDropdownOpen(!isDropdownOpen)}
                className="px-3 py-2 border rounded-lg flex-row border border-[#9e85f5] dark:border-[#fff] bg-white dark:bg-[#9e85f5]"
              >
                <Text className="text-black dark:text-white">
                  {t('tickets.show')} {selectedPageSize}
                </Text>
                <Icon
                  name={isDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                />
              </TouchableOpacity>
              {isDropdownOpen && (
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isDropdownOpen}
                  onRequestClose={() => setDropdownOpen(false)}
                >
                  <TouchableOpacity
                    className="flex-1 justify-end items-end mb-8"
                    onPress={() => setDropdownOpen(false)}
                  >
                    <View className="p-4 rounded-lg w-32 h-auto mr-4 border border-[#9e85f5] dark:border-[#fff] bg-white dark:bg-[#9e85f5]">
                      <FlatList
                        data={pageSizes}
                        renderItem={({ item }) => (
                          <TouchableOpacity onPress={() => handlePageSizeChange(item)}>
                            <Text className="p-2 text-black dark:text-white">{`Show ${item}`}</Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.toString()}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
