// src/screens/Progress.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  InputAccessoryView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LineChartCard from "../components/progress/LineChartCard";
import { useProgress } from "../context/ProgressContext";
import { getProgressFeedback } from "../services/progressService";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const todayISO = () => new Date().toISOString().split("T")[0];
const calcBMI = (weightLbs: number, heightInInches?: number) =>
  heightInInches ? +(703 * (weightLbs / (heightInInches * heightInInches))).toFixed(1) : undefined;

const PREFS_KEY = "@nutfit:progress:prefs";
type ProgressPrefs = { showBMI: boolean; showBodyFat: boolean; showMuscle: boolean };

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  placeholder,
  accessoryId,
}: {
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  keyboardType?: "decimal-pad" | "numeric" | "default";
  placeholder?: string;
  accessoryId?: string;
}) {
  return (
    <View className="mb-3">
      {label ? <Text className="text-white mb-1">{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        placeholder={placeholder}
        placeholderTextColor="#777"
        className="bg-neutral-800 text-white px-4 py-3 rounded-xl"
        {...(Platform.OS === "ios" ? { inputAccessoryViewID: accessoryId } : {})}
      />
    </View>
  );
}

export default function Progress() {
  const nav = useNavigation<any>();
  const {
    weightData,
    addWeightEntry,
    entries,
    addEntry,
    addBodyFat,
    addMuscleMass,
    addBMI,
    heightInInches,
    setHeightInInches,
  } = useProgress();

  // ── prefs (from settings)
  const [prefs, setPrefs] = useState<ProgressPrefs>({
    showBMI: true,
    showBodyFat: true,
    showMuscle: true,
  });

  // Load prefs initially
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ showBMI: true, showBodyFat: true, showMuscle: true, ...JSON.parse(raw) });
    })();
  }, []);

  // 🔁 Reload prefs whenever screen regains focus (so toggles apply immediately)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const raw = await AsyncStorage.getItem(PREFS_KEY);
        const p = raw ? JSON.parse(raw) : {};
        const merged: ProgressPrefs = { showBMI: true, showBodyFat: true, showMuscle: true, ...p };
        if (!active) return;
        setPrefs(merged);
        // Auto-collapse hidden sections for consistency
        if (!merged.showBodyFat) setShowBodyFatChart(false);
        if (!merged.showBMI) setShowBMIChart(false);
        if (!merged.showMuscle) setShowMuscleChart(false);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  // ── UI state
  const [logModal, setLogModal] = useState(false); // multi-stat (daily log)
  const [showSummary, setShowSummary] = useState(true);
  const [showWeightChart, setShowWeightChart] = useState(true);
  const [showBodyFatChart, setShowBodyFatChart] = useState(true);
  const [showBMIChart, setShowBMIChart] = useState(true);
  const [showMuscleChart, setShowMuscleChart] = useState(true);

  // per-stat mini modals
  const [weightOnlyModal, setWeightOnlyModal] = useState(false);
  const [bodyFatModal, setBodyFatModal] = useState(false);
  const [bmiModal, setBmiModal] = useState(false);
  const [muscleModal, setMuscleModal] = useState(false);

  // inputs for daily log
  const [inputWeight, setInputWeight] = useState("");
  const [inputBodyFat, setInputBodyFat] = useState("");
  const [inputMusclePct, setInputMusclePct] = useState("");
  const [inputHeightIn, setInputHeightIn] = useState(
    heightInInches ? String(heightInInches) : ""
  );
  const [editingHeight, setEditingHeight] = useState(!heightInInches);

  // inputs for mini modals
  const [weightOnlyValue, setWeightOnlyValue] = useState("");
  const [bodyFatValue, setBodyFatValue] = useState("");
  const [bmiValue, setBmiValue] = useState("");
  const [muscleValue, setMuscleValue] = useState("");

  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries]
  );

  // series
  const weightSeries = useMemo(
    () => ({
      labels: weightData.map((e) => e.date.slice(5)),
      data: weightData.map((e) => e.weight),
    }),
    [weightData]
  );

  const bodyFatSeries = useMemo(() => {
    const lbls: string[] = [],
      vals: number[] = [];
    for (const e of sorted) {
      if (typeof e.bodyFatPct === "number") {
        lbls.push(e.date.slice(5));
        vals.push(e.bodyFatPct);
      }
    }
    return { labels: lbls, data: vals };
  }, [sorted]);

  const bmiSeries = useMemo(() => {
    const lbls: string[] = [],
      vals: number[] = [];
    for (const e of sorted) {
      const val =
        typeof e.bmi === "number"
          ? e.bmi
          : e.weight
          ? calcBMI(e.weight, heightInInches)
          : undefined;
      if (typeof val === "number") {
        lbls.push(e.date.slice(5));
        vals.push(val);
      }
    }
    return { labels: lbls, data: vals };
  }, [sorted, heightInInches]);

  const muscleSeries = useMemo(() => {
    const lbls: string[] = [],
      vals: number[] = [];
    for (const e of sorted) {
      if (typeof e.muscleMassPct === "number") {
        lbls.push(e.date.slice(5));
        vals.push(e.muscleMassPct);
      }
    }
    return { labels: lbls, data: vals };
  }, [sorted]);

  // summary values
  const latestWeight = weightData.length
    ? weightData[weightData.length - 1].weight
    : undefined;
  const netChange = useMemo(
    () =>
      weightData.length < 2
        ? 0
        : +(
            weightData[weightData.length - 1].weight - weightData[0].weight
          ).toFixed(1),
    [weightData]
  );
  const ratePerWeek = useMemo(() => {
    if (weightData.length < 2) return 0;
    const first = weightData[0].date,
      last = weightData[weightData.length - 1].date;
    const days = Math.max(
      1,
      Math.round((+new Date(last) - +new Date(first)) / 86400000)
    );
    const delta =
      weightData[weightData.length - 1].weight - weightData[0].weight;
    return +(delta / (days / 7)).toFixed(2);
  }, [weightData]);

  const latestBodyFat = useMemo(() => {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (typeof sorted[i].bodyFatPct === "number") return sorted[i].bodyFatPct;
    }
    return undefined;
  }, [sorted]);

  const latestMusclePct = useMemo(() => {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (typeof sorted[i].muscleMassPct === "number")
        return sorted[i].muscleMassPct;
    }
    return undefined;
  }, [sorted]);

  const latestBMI = latestWeight ? calcBMI(latestWeight, heightInInches) : undefined;

  // actions
  const openDailyLog = () => {
    setInputWeight(latestWeight ? String(latestWeight) : "");
    setInputBodyFat(latestBodyFat ? String(latestBodyFat) : "");
    setInputMusclePct(latestMusclePct ? String(latestMusclePct) : "");
    setEditingHeight(!heightInInches);
    setInputHeightIn(heightInInches ? String(heightInInches) : "");
    setLogModal(true);
  };

  const saveDailyLog = async () => {
    const date = todayISO();
    const w = inputWeight.trim() ? parseFloat(inputWeight) : undefined;
    const bf = inputBodyFat.trim() ? parseFloat(inputBodyFat) : undefined;
    const mm = inputMusclePct.trim() ? parseFloat(inputMusclePct) : undefined;
    const h = inputHeightIn.trim() ? parseFloat(inputHeightIn) : undefined;

    if (editingHeight && h && !Number.isNaN(h)) await setHeightInInches(h);
    if (typeof w === "number" && !Number.isNaN(w))
      await addWeightEntry({ date, weight: w });
    await addEntry({ date, weight: w, bodyFatPct: bf, muscleMassPct: mm });
    setLogModal(false);
  };

  const handleGetFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const res = await getProgressFeedback(weightData, 30);
      setFeedback(res.feedback);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // per-stat saves
  const saveWeightOnly = async () => {
    const date = todayISO();
    const v = parseFloat(weightOnlyValue);
    if (!Number.isNaN(v)) {
      await addWeightEntry({ date, weight: v });
      await addEntry({ date, weight: v });
    }
    setWeightOnlyValue("");
    setWeightOnlyModal(false);
  };
  const saveBodyFatOnly = async () => {
    const date = todayISO();
    const v = parseFloat(bodyFatValue);
    if (!Number.isNaN(v)) await addBodyFat(date, v);
    setBodyFatValue("");
    setBodyFatModal(false);
  };
  const saveBMIOnly = async () => {
    const date = todayISO();
    const v = parseFloat(bmiValue);
    if (!Number.isNaN(v)) await addBMI(date, v);
    setBmiValue("");
    setBmiModal(false);
  };
  const saveMuscleOnly = async () => {
    const date = todayISO();
    const v = parseFloat(muscleValue);
    if (!Number.isNaN(v)) await addMuscleMass(date, v);
    setMuscleValue("");
    setMuscleModal(false);
  };

  const ACCESSORY_ID = "done-bar";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Progress</Text>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={openDailyLog} style={{ marginRight: 16 }}>
              <Ionicons name="add" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => nav.navigate?.("ProgressSettings")}>
              <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Log action card */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-6"
          onPress={openDailyLog}
        >
          <View className="flex-row items-center flex-1">
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <View className="ml-3">
              <Text className="text-white text-base font-semibold">Daily Log</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{todayISO()}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Summary (collapsible) */}
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-semibold mb-3">Summary</Text>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              setShowSummary((v) => !v);
            }}
          >
            <Ionicons
              name={showSummary ? "chevron-up" : "chevron-down"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {showSummary && (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
            <Text className="text-gray-300 text-sm">
              Weight: {latestWeight !== undefined ? `${latestWeight} lbs` : "—"}
            </Text>
            <Text className="text-gray-300 text-sm mt-1">
              Net: {netChange >= 0 ? "+" : ""}
              {netChange} lbs • Rate: {ratePerWeek >= 0 ? "+" : ""}
              {ratePerWeek} lbs/wk
            </Text>
            <Text className="text-gray-300 text-sm mt-1">
              Body Fat:{" "}
              {latestBodyFat !== undefined ? `${latestBodyFat}%` : "—"} • Muscle:{" "}
              {latestMusclePct !== undefined ? `${latestMusclePct}%` : "—"}
            </Text>
            <Text className="text-gray-300 text-sm mt-1">
              BMI:{" "}
              {typeof latestBMI === "number"
                ? latestBMI
                : heightInInches
                ? "—"
                : "set height to see BMI"}
            </Text>

            <TouchableOpacity
              onPress={handleGetFeedback}
              disabled={loadingFeedback || weightData.length === 0}
              className="bg-neutral-800 px-4 py-3 rounded-xl mt-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
                <Text className="text-white ml-2 font-semibold">
                  {loadingFeedback ? "Generating..." : "AI Progress Feedback"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </TouchableOpacity>

            {!!feedback && <Text className="text-gray-300 text-sm mt-3">{feedback}</Text>}
          </View>
        )}

        {/* WEIGHT */}
        <View className="flex-row justify-between items-center mt-6">
          <Text className="text-white text-lg font-semibold mb-3">Weight</Text>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setWeightOnlyModal(true)} style={{ marginRight: 8 }}>
              <Ionicons name="add-circle-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setShowWeightChart((v) => !v);
              }}
            >
              <Ionicons
                name={showWeightChart ? "chevron-up" : "chevron-down"}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>
        {showWeightChart && (
          <LineChartCard
            title="Weight (lbs)"
            labels={weightSeries.labels.length ? weightSeries.labels : [todayISO().slice(5)]}
            datasets={[{ data: weightSeries.data.length ? weightSeries.data : [0] }]}
          />
        )}

        {/* BODY FAT % */}
        {prefs.showBodyFat && (
          <>
            <View className="flex-row justify-between items-center mt-6">
              <Text className="text-white text-lg font-semibold mb-3">Body Fat %</Text>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => setBodyFatModal(true)} style={{ marginRight: 8 }}>
                  <Ionicons name="add-circle-outline" size={22} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    setShowBodyFatChart((v) => !v);
                  }}
                >
                  <Ionicons
                    name={showBodyFatChart ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {showBodyFatChart && bodyFatSeries.data.length > 0 && (
              <LineChartCard
                title="Body Fat %"
                labels={bodyFatSeries.labels}
                datasets={[{ data: bodyFatSeries.data }]}
              />
            )}
          </>
        )}

        {/* BMI */}
        {prefs.showBMI && (
          <>
            <View className="flex-row justify-between items-center mt-6">
              <Text className="text-white text-lg font-semibold mb-3">BMI</Text>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => setBmiModal(true)} style={{ marginRight: 8 }}>
                  <Ionicons name="add-circle-outline" size={22} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    setShowBMIChart((v) => !v);
                  }}
                >
                  <Ionicons
                    name={showBMIChart ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {showBMIChart && bmiSeries.data.length > 0 && (
              <LineChartCard title="BMI" labels={bmiSeries.labels} datasets={[{ data: bmiSeries.data }]} />
            )}
          </>
        )}

        {/* MUSCLE MASS % */}
        {prefs.showMuscle && (
          <>
            <View className="flex-row justify-between items-center mt-6">
              <Text className="text-white text-lg font-semibold mb-3">Muscle Mass %</Text>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => setMuscleModal(true)} style={{ marginRight: 8 }}>
                  <Ionicons name="add-circle-outline" size={22} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    setShowMuscleChart((v) => !v);
                  }}
                >
                  <Ionicons
                    name={showMuscleChart ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {showMuscleChart && muscleSeries.data.length > 0 && (
              <LineChartCard
                title="Muscle Mass %"
                labels={muscleSeries.labels}
                datasets={[{ data: muscleSeries.data }]}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* iOS Done bar for all modal inputs */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID="done-bar">
          <View
            style={{
              backgroundColor: "#111",
              padding: 8,
              alignItems: "flex-end",
              borderTopWidth: 1,
              borderTopColor: "#222",
            }}
          >
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}

      {/* DAILY LOG MODAL */}
      <Modal visible={logModal} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
            >
              <Pressable onPress={() => {}} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16 }}>
                <Text className="text-white text-lg font-semibold mb-3">
                  Log Today’s Entry ({todayISO()})
                </Text>

                <Field
                  label="Weight (lbs)"
                  value={inputWeight}
                  onChangeText={setInputWeight}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 160.5"
                  accessoryId="done-bar"
                />
                <Field
                  label="Body Fat (%)"
                  value={inputBodyFat}
                  onChangeText={setInputBodyFat}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 14.2"
                  accessoryId="done-bar"
                />
                <Field
                  label="Muscle Mass (%)"
                  value={inputMusclePct}
                  onChangeText={setInputMusclePct}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 42.5"
                  accessoryId="done-bar"
                />

                <View className="flex-row items-center justify-between mt-2 mb-1">
                  <Text className="text-white font-semibold">Height (in)</Text>
                  <TouchableOpacity onPress={() => setEditingHeight((v) => !v)}>
                    <Text className="text-gray-300">
                      {editingHeight ? "Keep current" : "Edit"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {editingHeight && (
                  <Field
                    label=""
                    value={inputHeightIn}
                    onChangeText={setInputHeightIn}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 70"
                    accessoryId="done-bar"
                  />
                )}

                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity onPress={() => setLogModal(false)}>
                    <Text className="text-gray-300 mr-6">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveDailyLog}>
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* MINI MODALS: single-stat quick adds */}
      <Modal visible={weightOnlyModal} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
            >
              <Pressable onPress={() => {}} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16 }}>
                <Text className="text-white text-lg font-semibold mb-3">Add Weight (lbs)</Text>
                <Field
                  label=""
                  value={weightOnlyValue}
                  onChangeText={setWeightOnlyValue}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 160.5"
                  accessoryId="done-bar"
                />
                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity onPress={() => setWeightOnlyModal(false)}>
                    <Text className="text-gray-300 mr-6">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveWeightOnly}>
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal visible={bodyFatModal} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
            >
              <Pressable onPress={() => {}} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16 }}>
                <Text className="text-white text-lg font-semibold mb-3">Add Body Fat (%)</Text>
                <Field
                  label=""
                  value={bodyFatValue}
                  onChangeText={setBodyFatValue}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 14.2"
                  accessoryId="done-bar"
                />
                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity onPress={() => setBodyFatModal(false)}>
                    <Text className="text-gray-300 mr-6">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveBodyFatOnly}>
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal visible={bmiModal} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
            >
              <Pressable onPress={() => {}} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16 }}>
                <Text className="text-white text-lg font-semibold mb-3">Add BMI</Text>
                <Field
                  label=""
                  value={bmiValue}
                  onChangeText={setBmiValue}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 23.1"
                  accessoryId="done-bar"
                />
                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity onPress={() => setBmiModal(false)}>
                    <Text className="text-gray-300 mr-6">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveBMIOnly}>
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal visible={muscleModal} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
            >
              <Pressable onPress={() => {}} style={{ backgroundColor: "#111", borderRadius: 16, padding: 16 }}>
                <Text className="text-white text-lg font-semibold mb-3">Add Muscle Mass (%)</Text>
                <Field
                  label=""
                  value={muscleValue}
                  onChangeText={setMuscleValue}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 42.5"
                  accessoryId="done-bar"
                />
                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity onPress={() => setMuscleModal(false)}>
                    <Text className="text-gray-300 mr-6">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveMuscleOnly}>
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* iOS accessory view */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID="done-bar">
          <View
            style={{
              backgroundColor: "#111",
              padding: 8,
              alignItems: "flex-end",
              borderTopWidth: 1,
              borderTopColor: "#222",
            }}
          >
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
}
