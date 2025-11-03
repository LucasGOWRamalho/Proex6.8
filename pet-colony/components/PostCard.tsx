import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface Pet {
  id: number;
  name: string;
  breed: string;
  color: string;
  size: string;
  age: string;
  collar: boolean;
  collarNumber: string;
  reward: boolean;
  rewardValue: number;
  status: 'lost' | 'found';
  location: string;
  photos: string[];
  description: string;
  date: string;
  user: string;
  timeAgo: string;
}

interface PostCardProps {
  pet: Pet;
  onLike?: (petId: number) => void;
  onShare?: (petId: number) => void;
  onComment?: (petId: number) => void;
}

export default function PostCard({ pet, onLike, onShare, onComment }: PostCardProps) {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(pet.id);
  };

  const handleShare = () => {
    // Gera um link falso e mostra um alerta
    const fakeLink = `https://petfinder.com/pet/${pet.id}`;
    Alert.alert('Compartilhar', `Link copiado: ${fakeLink}`);
    onShare?.(pet.id);
  };

  const handleSeen = () => {
    setShowMessage(true);
  };

  const handleSendMessage = () => {
    setShowMessage(false);
    setMessage('');
    Alert.alert('Mensagem enviada', 'Sua mensagem foi enviada ao responsável!');
  };

  const handleComment = () => {
    setShowComment(true);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      setComments(prev => [...prev, comment]);
      setComment('');
      setShowComment(false);
    }
  };

  const getStatusColor = () => {
    return pet.status === 'lost' ? '#FF6B6B' : '#4ECDC4';
  };

  const getStatusText = () => {
    return pet.status === 'lost' ? 'PERDIDO' : 'ENCONTRADO';
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <Text style={styles.avatarText}>{pet.user.charAt(0)}</Text>
          </View>
          <View>
            <Text style={[styles.username, { color: Colors[colorScheme ?? 'light'].text }]}>
              {pet.user}
            </Text>
            <Text style={[styles.timeAgo, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {pet.timeAgo}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Image */}
      <Image
        source={{ uri: pet.photos[0] }}
        style={styles.image}
        contentFit="cover"
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <IconSymbol
            name={liked ? "heart.fill" : "heart"}
            size={24}
            color={liked ? "#FF6B6B" : Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <IconSymbol
            name="message"
            size={24}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <IconSymbol
            name="paperplane"
            size={24}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSeen}>
          <IconSymbol
            name="chevron.right"
            size={24}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </TouchableOpacity>
        {/* Botão para comentar */}
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontWeight: 'bold', marginLeft: 4 }}>Comentar</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de mensagem para "Eu vi esse cachorro" */}
      {showMessage && (
        <View style={styles.messageBox}>
          <Text style={{ marginBottom: 6, color: Colors[colorScheme ?? 'light'].text }}>Envie uma mensagem para o responsável:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Campo de comentário */}
      {showComment && (
        <View style={styles.messageBox}>
          <Text style={{ marginBottom: 6, color: Colors[colorScheme ?? 'light'].text }}>Comentar na foto:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu comentário..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Comentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de comentários */}
      {comments.length > 0 && (
        <View style={styles.commentsBox}>
          {comments.map((c, idx) => (
            <Text key={idx} style={{ color: Colors[colorScheme ?? 'light'].text, marginBottom: 2 }}>
              {c}
            </Text>
          ))}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.likes, { color: Colors[colorScheme ?? 'light'].text }]}>
          {likeCount} curtidas
        </Text>
        
        <View style={styles.petInfo}>
          <Text style={[styles.petName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {pet.name}
          </Text>
          <Text style={[styles.petDetails, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {pet.breed} • {pet.size} • {pet.age}
          </Text>
        </View>

        <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>
          {pet.description}
        </Text>

        <View style={styles.locationContainer}>
          <IconSymbol
            name="location"
            size={16}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {pet.location}
          </Text>
        </View>

        {pet.reward && (
          <View style={styles.rewardContainer}>
            <IconSymbol
              name="dollarsign.circle.fill"
              size={16}
              color="#4ECDC4"
            />
            <Text style={[styles.reward, { color: '#4ECDC4' }]}>
              Recompensa: R$ {pet.rewardValue}
            </Text>
          </View>
        )}

        {pet.collar && pet.collarNumber && (
          <View style={styles.collarContainer}>
            <IconSymbol
              name="phone.fill"
              size={16}
              color={Colors[colorScheme ?? 'light'].tint}
            />
            <Text style={[styles.collarNumber, { color: Colors[colorScheme ?? 'light'].tint }]}>
              Coleira: {pet.collarNumber}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
  },
  timeAgo: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  image: {
    width: width - 30,
    height: 300,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  actionButton: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  messageBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    minHeight: 40,
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  likes: {
    fontWeight: '600',
    marginBottom: 8,
  },
  petInfo: {
    marginBottom: 8,
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 14,
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reward: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  collarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collarNumber: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  commentsBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 8,
  },
});
