import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import DataPagination from '@/components/DataPaginations';
import { GET_TICKETS } from '@/graphql/queries/tickets.queries';
import { darkActions, lightActions } from '@/assets/Icons/dashboard/Icons';
import ActionsDropdown from '@/components/TicketsActions';
import TicketDetailsModal from '@/components/TicketsDetailsModal';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  user: { email: string };
  assignee: { email: string };
  action: string;
}

interface TicketsData {
  getAllTickets: Ticket[];
}

interface TicketsQueryVariables { }

export default function Tickets() {
  const { t } = useTranslation();
  const [filterInput, setFilterInput] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const toast = useToast();
  const colorScheme = useColorScheme();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);


  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';
  const inputbg = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) setUserToken(token);
      else toast.show('Token not found', { type: "danger" });
    };
    fetchToken();
  }, []);

  const { data: ticketsData, loading: ticketsLoading, error } = useQuery<TicketsData, TicketsQueryVariables>(GET_TICKETS, {
    context: {
      headers: { Authorization: `Bearer ${userToken}` },
    },
    skip: !userToken,
  });

  useEffect(() => {
    if (ticketsData?.getAllTickets) {
      setFilteredTickets(ticketsData.getAllTickets);
      setTotalPages(Math.ceil(ticketsData.getAllTickets.length / pageSize));
    }
  }, [ticketsData, pageSize]);

  useEffect(() => {
    if (error) {
      toast.show('Error fetching tickets', { type: "danger" });
    }
  }, [ticketsLoading, error]);

  const handleFilterChange = (value: string) => {
    setFilterInput(value);
    const lowercasedValue = value.toLowerCase();
    const filteredData = ticketsData?.getAllTickets.filter(ticket =>
      ticket.subject.toLowerCase().includes(lowercasedValue) ||
      ticket.message.toLowerCase().includes(lowercasedValue) ||
      ticket.user.email.toLowerCase().includes(lowercasedValue) ||
      ticket.assignee.email.toLowerCase().includes(lowercasedValue)
    );
    setFilteredTickets(filteredData || []);
    setPageIndex(0);
    setTotalPages(Math.ceil((filteredData?.length || 0) / pageSize));
  };

  const currentTickets = filteredTickets.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
    setTotalPages(Math.ceil(filteredTickets.length / size));
  };

  const nextPage = () => {
    if (pageIndex < totalPages - 1) setPageIndex(pageIndex + 1);
  };

  const previousPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  const gotoPage = (page: number) => {
    if (page >= 0 && page < totalPages) setPageIndex(page);
  };

  const formatDate = (value: string) => {
    const date = new Date(parseInt(value, 10));
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const pageOptions = Array.from({ length: totalPages }, (_, i) => i);

  const handleActionsPress = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsDropdownVisible(true);
  };

  const openFeedbackModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
    setIsDropdownVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
  };

  return (
    <View>
      <ScrollView className={`relative ${bgColor} w-fit`}>
        <View className="h-auto pt-5">
          <Text className={`font-bold p-3 text-2xl ${textColor}`}>{t('tickets.title')}</Text>
          <View className="px-3">
            <TextInput
              className={`border p-2 border-[#8667F2] rounded-md bg-white ${inputbg}`}
              placeholder={t('tickets.filter')}
              value={filterInput}
              onChangeText={handleFilterChange}
              returnKeyType="done"
            />
          </View>

          <View className={`px-3 rounded h-auto mb-16 ${textColor}`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View className="flex-row justify-between bg-[#c7d2fe] py-4 px-2 border-b border-[#b1b1b1] mt-5 rounded-tl-lg rounded-tr-lg">
                  <Text className="w-24 text-sm font-bold">{t('tickets.subject')}</Text>
                  <Text className="w-24 text-sm font-bold">{t('tickets.message')}</Text>
                  <Text className="w-28 text-sm font-bold">{t('tickets.createDate')}</Text>
                  <Text className="w-44 text-sm font-bold">{t('tickets.assigner')}</Text>
                  <Text className="w-44 text-sm font-bold">{t('tickets.assignee')}</Text>
                  <Text className="w-20 text-sm font-bold">{t('tickets.action')}</Text>
                </View>

                {ticketsLoading ? (
                  <Text className={`${textColor} text-center font-bold p-10`}>Loading tickets...</Text>
                ) :
                currentTickets.length ? (
                  currentTickets.map((ticket) => (
                    <View key={ticket.id} className="flex-row justify-around border-b border-[#b1b1b1] py-2">
                      <Text className={`w-24 ${textColor} px-1`}>{ticket.subject}</Text>
                      <Text className={`w-24 ${textColor} px-1`}>{ticket.message}</Text>
                      <Text className={`w-28 ${textColor} px-1`}>{formatDate(ticket.createdAt)}</Text>
                      <Text className={`w-44 ${textColor} px-1`}>{ticket.user?.email}</Text>
                      <Text className={`w-48 ${textColor} px-1`}>{ticket.assignee?.email}</Text>
                      <View className="rounded-full justify-center align-middle px-3 py-2 w-20">
                        <TouchableOpacity onPress={() => handleActionsPress(ticket.id)} className="flex-row items-center text-white">
                          <SvgXml xml={colorScheme === 'dark' ? darkActions : lightActions} />
                        </TouchableOpacity>
                        {isDropdownVisible && selectedTicketId === ticket.id && (
                <ActionsDropdown
                  ticketId={ticket.id}
                  onView={() => openFeedbackModal(ticket)}
                  onClose={() => setIsDropdownVisible(false)}
                />
              )}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className={`${textColor} text-center font-bold p-10`}>{t('tickets.noTickets')}</Text>
                )}
              </View>
            </ScrollView>

            <DataPagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalPages={totalPages}
              gotoPage={gotoPage}
              nextPage={nextPage}
              previousPage={previousPage}
              canNextPage={pageIndex < totalPages - 1}
              canPreviousPage={pageIndex > 0}
              setPageSize={handlePageSizeChange}
              pageOptions={pageOptions}
              columnLength={currentTickets.length}
            />
            <TicketDetailsModal
        visible={isModalVisible}
        onClose={closeModal}
        ticket={selectedTicket}
      />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
