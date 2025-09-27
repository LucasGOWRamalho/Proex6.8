import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import Animated, {useSharedValue,useAnimatedStyle,runOnJS,withSpring,interpolate,Extrapolate} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = screenHeight * 0.7;

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

interface PetCardProps {
  pet: Pet;
  onSwipeLeft?: (petId: number) => void;
  onSwipeRight?: (petId: number) => void;
  onSwipeUp?: (petId: number) => void;
  isTop?: boolean;
}

const AnimatedPanGestureHandler = Animated.createAnimatedComponent(PanGestureHandler);

export default function PetCard({ pet, onSwipeLeft, onSwipeRight, onSwipeUp, isTop = false }: PetCardProps) {
  const colorScheme = useColorScheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isTop ? 1 : 0.95);

  const getStatusColor = () => {
    return pet.status === 'lost' ? '#FF6B6B' : '#4ECDC4';
  };

  const getStatusText = () => {
    return pet.status === 'lost' ? 'PERDIDO' : 'ENCONTRADO';
  };

  const getDistanceText = () => {
    const distances = ['0.5km', '1.2km', '2.1km', '3.5km', '5.0km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(1);
    },
    onActive: (event: PanGestureHandlerGestureEvent) => {
      translateX.value = event.nativeEvent.translationX;
      translateY.value = event.nativeEvent.translationY;
    },
    onEnd: (event: PanGestureHandlerGestureEvent) => {
      const shouldSwipeLeft = translateX.value < -screenWidth * 0.25;
      const shouldSwipeRight = translateX.value > screenWidth * 0.25;
      const shouldSwipeUp = translateY.value < -screenHeight * 0.15;

      if (shouldSwipeLeft) {
        translateX.value = withSpring(-screenWidth);
        runOnJS(onSwipeLeft || (() => {}))(pet.id);
      } else if (shouldSwipeRight) {
        translateX.value = withSpring(screenWidth);
        runOnJS(onSwipeRight || (() => {}))(pet.id);
      } else if (shouldSwipeUp) {
        translateY.value = withSpring(-screenHeight);
        runOnJS(onSwipeUp || (() => {}))(pet.id);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value) + Math.abs(translateY.value),
      [0, screenWidth * 0.5],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  const leftLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-screenWidth * 0.25, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const rightLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, screenWidth * 0.25],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const upLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-screenHeight * 0.15, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <AnimatedPanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Swipe Labels */}
        <Animated.View style={[styles.swipeLabel, styles.leftLabel, leftLabelStyle]}>
          <Text style={styles.swipeLabelText}>NÃO VI</Text>
        </Animated.View>
        
        <Animated.View style={[styles.swipeLabel, styles.rightLabel, rightLabelStyle]}>
          <Text style={styles.swipeLabelText}>VI ESTE</Text>
        </Animated.View>
        
        <Animated.View style={[styles.swipeLabel, styles.upLabel, upLabelStyle]}>
          <Text style={styles.swipeLabelText}>SALVAR</Text>
        </Animated.View>

        {/* Card Content */}
        <View style={[styles.cardContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          {/* Image */}
          <Image
            source={{ uri: pet.photos[0] }}
            style={styles.image}
            contentFit="cover"
          />

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>

          {/* Pet Info */}
          <View style={styles.petInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.petName, { color: Colors[colorScheme ?? 'light'].text }]}>
                {pet.name}
              </Text>
              <Text style={[styles.petAge, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {pet.age}
              </Text>
            </View>
            
            <Text style={[styles.petBreed, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {pet.breed} • {pet.size}
            </Text>

            <View style={styles.locationRow}>
              <IconSymbol
                name="location"
                size={16}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
              />
              <Text style={[styles.location, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {getDistanceText()} • {getStatusText()}
              </Text>
            </View>

            <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>
              {pet.description}
            </Text>

            {pet.reward && (
              <View style={styles.rewardContainer}>
                <IconSymbol
                  name="dollarsign.circle.fill"
                  size={18}
                  color="#4ECDC4"
                />
                <Text style={styles.rewardText}>
                  Recompensa: R$ {pet.rewardValue}
                </Text>
              </View>
            )}

            {pet.collar && pet.collarNumber && (
              <View style={styles.contactContainer}>
                <IconSymbol
                  name="phone.fill"
                  size={16}
                  color={Colors[colorScheme ?? 'light'].tint}
                />
                <Text style={[styles.contactText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  {pet.collarNumber}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </AnimatedPanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  statusBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  petInfo: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  petAge: {
    fontSize: 20,
    fontWeight: '500',
  },
  petBreed: {
    fontSize: 18,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 6,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    flex: 1,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  swipeLabel: {
    position: 'absolute',
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  leftLabel: {
    top: 100,
    left: 20,
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    transform: [{ rotate: '-30deg' }],
  },
  rightLabel: {
    top: 100,
    right: 20,
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    transform: [{ rotate: '30deg' }],
  },
  upLabel: {
    top: 50,
    alignSelf: 'center',
    borderColor: '#FFD93D',
    backgroundColor: 'rgba(255, 217, 61, 0.1)',
  },
  swipeLabelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
