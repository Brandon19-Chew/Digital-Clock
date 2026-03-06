import { useEffect, useState } from "react";
import { Text, View, useWindowDimensions, Pressable } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { SettingsModal } from "@/components/settings-modal";
import { useClockSettings } from "@/lib/clock-settings-context";

/**
 * Digital Clock Screen
 *
 * Displays the current time in a large, mirror-style format inspired by the Sharp alarm clock.
 * Updates every second to show real-time. Supports both portrait and landscape orientations.
 */
export default function HomeScreen() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { settings } = useClockSettings();

  useEffect(() => {
    // Set initial time
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [settings.is24Hour]);

  const updateTime = () => {
    const now = new Date();

    // Format time based on 12/24 hour preference
    let hours = now.getHours();
    const minutes = now.getMinutes();

    if (!settings.is24Hour) {
      hours = hours % 12 || 12;
    }

    const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    setTime(timeString);
    setDate(dateString);
  };

  return (
    <>
      <ScreenContainer
        className="flex-1 items-center justify-center"
        containerClassName="flex-1"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        {/* Settings Button */}
        <Pressable
          onPress={() => setSettingsVisible(true)}
          style={({ pressed }) => [
            {
              position: "absolute",
              top: 20,
              right: 20,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-3xl">⚙️</Text>
        </Pressable>

        <View
          className={`items-center ${isLandscape ? "flex-row gap-8" : "gap-4"}`}
        >
          {/* Time Display */}
          <Text
            className="font-bold"
            style={{
              fontSize: isLandscape ? 80 : 120,
              fontFamily: "Courier New",
              letterSpacing: isLandscape ? 4 : 8,
              lineHeight: isLandscape ? 100 : 140,
              color: settings.timeColor,
            }}
          >
            {time}
          </Text>

          {/* Date and AM/PM Container */}
          <View className={`items-${isLandscape ? "start" : "center"} gap-2`}>
            {/* Date Display */}
            {settings.dateVisible && (
              <Text
                className="text-lg tracking-wide"
                style={{
                  color: settings.timeColor,
                  opacity: 0.7,
                }}
              >
                {date}
              </Text>
            )}

            {/* AM/PM Indicator (only in 12-hour mode) */}
            {!settings.is24Hour && (
              <Text
                className="text-sm"
                style={{
                  color: settings.timeColor,
                  opacity: 0.6,
                }}
              >
                {new Date().getHours() >= 12 ? "PM" : "AM"}
              </Text>
            )}
          </View>
        </View>
      </ScreenContainer>

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </>
  );
}
