import { ScrollView, Text, View, Pressable, Switch, Modal } from "react-native";
import { useClockSettings } from "@/lib/clock-settings-context";

const BACKGROUND_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#1a1a1a" },
  { name: "Navy", value: "#001a4d" },
  { name: "Dark Blue", value: "#0a1f3f" },
  { name: "Dark Green", value: "#0d2818" },
  { name: "Dark Red", value: "#3d0000" },
];

const TIME_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#e0e0e0" },
  { name: "Cyan", value: "#00ffff" },
  { name: "Green", value: "#00ff00" },
  { name: "Red", value: "#ff0000" },
  { name: "Yellow", value: "#ffff00" },
];

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useClockSettings();

  const handleBackgroundColorChange = async (color: string) => {
    await updateSettings({ backgroundColor: color });
  };

  const handleTimeColorChange = async (color: string) => {
    await updateSettings({ timeColor: color });
  };

  const handleToggle24Hour = async (value: boolean) => {
    await updateSettings({ is24Hour: value });
  };

  const handleToggleDateVisible = async (value: boolean) => {
    await updateSettings({ dateVisible: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-900">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-6 gap-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4 pt-4">
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-2xl text-blue-400">← Back</Text>
              </Pressable>
              <Text className="text-3xl font-bold text-white">Settings</Text>
              <View style={{ width: 60 }} />
            </View>

            {/* Background Color Section */}
            <View className="gap-3">
              <Text className="text-xl font-semibold text-white">
                Background Color
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {BACKGROUND_COLORS.map((color) => (
                  <Pressable
                    key={color.value}
                    onPress={() => handleBackgroundColorChange(color.value)}
                    style={({ pressed }) => [
                      {
                        width: "30%",
                        aspectRatio: 1,
                        backgroundColor: color.value,
                        borderRadius: 12,
                        borderWidth:
                          settings.backgroundColor === color.value ? 3 : 0,
                        borderColor: "#00ffff",
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View className="flex-1 items-center justify-center">
                      {settings.backgroundColor === color.value && (
                        <Text className="text-white font-bold text-lg">✓</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
              <Text className="text-sm text-gray-400">
                {
                  BACKGROUND_COLORS.find(
                    (c) => c.value === settings.backgroundColor
                  )?.name
                }
              </Text>
            </View>

            {/* Time Color Section */}
            <View className="gap-3">
              <Text className="text-xl font-semibold text-white">
                Time Color
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {TIME_COLORS.map((color) => (
                  <Pressable
                    key={color.value}
                    onPress={() => handleTimeColorChange(color.value)}
                    style={({ pressed }) => [
                      {
                        width: "30%",
                        aspectRatio: 1,
                        backgroundColor: color.value,
                        borderRadius: 12,
                        borderWidth:
                          settings.timeColor === color.value ? 3 : 0,
                        borderColor: "#ffffff",
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View className="flex-1 items-center justify-center">
                      {settings.timeColor === color.value && (
                        <Text className="text-black font-bold text-lg">✓</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
              <Text className="text-sm text-gray-400">
                {TIME_COLORS.find((c) => c.value === settings.timeColor)?.name}
              </Text>
            </View>

            {/* Time Format Section */}
            <View className="bg-gray-800 rounded-lg p-4 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-white">
                  24-Hour Format
                </Text>
                <Switch
                  value={settings.is24Hour}
                  onValueChange={handleToggle24Hour}
                  trackColor={{ false: "#767577", true: "#81c784" }}
                  thumbColor={settings.is24Hour ? "#4caf50" : "#f4f3f4"}
                />
              </View>
              <Text className="text-sm text-gray-400">
                {settings.is24Hour
                  ? "Time displays in 24-hour format"
                  : "Time displays in 12-hour format with AM/PM"}
              </Text>
            </View>

            {/* Date Visibility Section */}
            <View className="bg-gray-800 rounded-lg p-4 gap-4 mb-6">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-white">
                  Show Date
                </Text>
                <Switch
                  value={settings.dateVisible}
                  onValueChange={handleToggleDateVisible}
                  trackColor={{ false: "#767577", true: "#81c784" }}
                  thumbColor={settings.dateVisible ? "#4caf50" : "#f4f3f4"}
                />
              </View>
              <Text className="text-sm text-gray-400">
                {settings.dateVisible
                  ? "Date is displayed below the time"
                  : "Date is hidden"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
