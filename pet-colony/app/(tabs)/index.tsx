import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import PostCard from '@/components/PostCard';
import mockPets from '@/data/mockPets';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [pets, setPets] = useState(mockPets);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular carregamento de novos dados
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Atualizado!', 'Feed atualizado com sucesso');
    }, 1000);
  }, []);

  const handleLike = (petId: number) => {
    console.log('Liked pet:', petId);
  };

  const handleShare = (petId: number) => {
    const pet = pets.find(p => p.id === petId);
    Alert.alert(
      'Compartilhar',
      `Compartilhar informações sobre ${pet?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartilhar', onPress: () => console.log('Shared pet:', petId) }
      ]
    );
  };

  const handleComment = (petId: number) => {
    const pet = pets.find(p => p.id === petId);
    Alert.alert('Comentários', `Comentários sobre ${pet?.name}`);
  };

  const handleAddPost = () => {
    Alert.alert(
      'Novo Post',
      'Deseja cadastrar um novo pet?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cadastrar', onPress: () => console.log('Add new post') }
      ]
    );
  };

  const handleSearch = () => {
    Alert.alert('Buscar', 'Funcionalidade de busca em desenvolvimento');
  };

  const renderPet = ({ item }: { item: any }) => (
    <PostCard
      pet={item}
      onLike={handleLike}
      onShare={handleShare}
      onComment={handleComment}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.headerLeft}>
          <IconSymbol
            name="pawprint.fill"
            size={28}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            PetFinder
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
            <IconSymbol
              name="magnifyingglass"
              size={24}
              color={Colors[colorScheme ?? 'light'].text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleAddPost}>
            <IconSymbol
              name="plus.circle"
              size={24}
              color={Colors[colorScheme ?? 'light'].text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  feedContainer: {
    padding: 15,
  },
});
