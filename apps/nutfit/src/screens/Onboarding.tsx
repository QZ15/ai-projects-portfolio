import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to NutFit",
    subtitle: "Your AI-powered fitness journey starts here",
    image: require("../../assets/onboarding/welcome.png"),
  },
  {
    id: "2",
    title: "Smart Meal Planning",
    subtitle: "AI-based plans tailored to your goals",
    image: require("../../assets/onboarding/mealplanner.png"),
  },
  {
    id: "3",
    title: "Personalized Workouts",
    subtitle: "Custom plans built for your level",
    image: require("../../assets/onboarding/workout.png"),
  },
  {
    id: "4",
    title: "You’re All Set!",
    subtitle: "Let’s reach your goals together",
    image: require("../../assets/onboarding/ready.png"),
  },
];

export default function Onboarding() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({ index: currentIndex, animated: true });
  }, [currentIndex]);

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
    } catch (e) {
      console.log("Error finishing onboarding:", e);
    }
    navigation.navigate("Login" as never);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Skip button */}
      <View className="absolute top-4 right-5 z-10">
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-blue-400 font-medium">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="w-screen items-center justify-center px-6">
            <Image
              source={item.image}
              className="w-[80%] h-[50%] rounded-3xl mb-6"
              resizeMode="cover"
            />
            <Text className="text-white text-2xl font-bold text-center mb-2">
              {item.title}
            </Text>
            <Text className="text-gray-400 text-base text-center">
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center mt-6 mb-6">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentIndex ? "bg-blue-400" : "bg-gray-500"
            }`}
          />
        ))}
      </View>

      {/* Next / Finish button */}
      <View className="px-6 mb-6">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-500 py-4 rounded-full items-center"
        >
          <Text className="text-white font-semibold text-lg">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
