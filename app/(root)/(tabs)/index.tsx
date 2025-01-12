import { Card, FeaturedCard } from '@/components/cards';
import Filters from '@/components/filters';
import NoResults from '@/components/noResults';
import Search from '@/components/search';
import icons from '@/constants/icons';
import { getLatestProperties, getProperties } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { useAppwrite } from '@/lib/useAppwrite';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({ fn: getLatestProperties });
  const {
    data: properties,
    loading: propertiesLoading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: { filter: params.filter!, query: params.query!, limit: 6 },
    skip: true,
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  useEffect(() => {
    refetch({ filter: params.filter!, query: params.query!, limit: 6 });
  }, [params.query, params.filter]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName='pb-32'
        columnWrapperClassName='flex gap-5 px-5'
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          propertiesLoading ? (
            <ActivityIndicator size='large' className='text-primary-300 mt-5' />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className='px-5'>
            <View className='flex flex-row items-center justify-between mt-5'>
              <View className='flex flex-row'>
                <Image
                  source={{ uri: user?.avatar }}
                  className='size-12 rounded-full'
                />
                <View className='flex flex-col items-start justify-center ml-2'>
                  <Text className='text-xs font-rubik text-black-100'>
                    {getGreeting()}
                  </Text>
                  <Text className='text-base font-rubik-medium text-black-300'>
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className='size-6' />
            </View>
            <Search />
            <View className='my-5'>
              <View className='flex flex-row itesm-center justify-between'>
                <Text className='text-xl font-rubik-bold text-black-300'>
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className='text-base font-rubik-bold text-primary-300'>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {latestPropertiesLoading ? (
                <ActivityIndicator size='large' className='text-primary-300' />
              ) : !latestProperties || latestProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  contentContainerClassName='flex gap-5 mt-5'
                />
              )}
            </View>
            <View className='flex flex-row itesm-center justify-between'>
              <Text className='text-xl font-rubik-bold text-black-300'>
                Our Reccomendations
              </Text>
              <TouchableOpacity>
                <Text className='text-base font-rubik-bold text-primary-300'>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
