import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ClockSettings {
  backgroundColor: string;
  timeColor: string;
  is24Hour: boolean;
  dateVisible: boolean;
}

const DEFAULT_SETTINGS: ClockSettings = {
  backgroundColor: "#000000",
  timeColor: "#ffffff",
  is24Hour: false,
  dateVisible: true,
};

interface ClockSettingsContextType {
  settings: ClockSettings;
  updateSettings: (newSettings: Partial<ClockSettings>) => Promise<void>;
  isLoading: boolean;
}

const ClockSettingsContext = createContext<ClockSettingsContextType | undefined>(
  undefined
);

export function ClockSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<ClockSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem("clockSettings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<ClockSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(
        "clockSettings",
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <ClockSettingsContext.Provider
      value={{ settings, updateSettings, isLoading }}
    >
      {children}
    </ClockSettingsContext.Provider>
  );
}

export function useClockSettings() {
  const context = useContext(ClockSettingsContext);
  if (!context) {
    throw new Error(
      "useClockSettings must be used within ClockSettingsProvider"
    );
  }
  return context;
}
