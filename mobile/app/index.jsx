import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BENEFIT_CARDS,
  DEFAULT_IMAGE_JOURNEY_CARDS,
  LEGAL_AND_PRICING_CONFIG,
  REGIONAL_HELP_RESOURCES
} from '../../src/data/clearPathData.js';
import {
  calculateQuitProgress,
  calculateSavingsEstimates,
  createDefaultUserState,
  evaluateMilestones,
  filterImagesForIntensity,
  handleCompassionateSetback,
  recordCalendarDayStatus
} from '../../src/engine/clearPathEngine.js';

export default function ClearPathNativeScreen() {
  const [state, setState] = useState(() => createDefaultUserState());
  const [activeTab, setActiveTab] = useState('today');
  const [imageIdx, setImageIdx] = useState(0);

  const progress = calculateQuitProgress(state);
  const estimates = calculateSavingsEstimates(state);
  const milestones = evaluateMilestones(state);
  const images = filterImagesForIntensity(DEFAULT_IMAGE_JOURNEY_CARDS, state.visualIntensity);
  const currentCard = images[imageIdx % images.length];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.badge}>
          {LEGAL_AND_PRICING_CONFIG.pricing.displayPrice} One-Time • Offline • No Account Required
        </Text>
        <Text style={styles.title}>
          {progress.effectiveSmokeFreeDays} Smoke-Free Day
          {progress.effectiveSmokeFreeDays === 1 ? '' : 's'}
        </Text>
        <Text style={styles.subtitle}>
          Clear Path by {LEGAL_AND_PRICING_CONFIG.companyName} — Educational &amp; Motivational Support (Not Medical Care)
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          accessibilityRole="button"
          accessibilityLabel="Mark Today Smoke-Free"
          onPress={() => setState((prev) => recordCalendarDayStatus(prev, progress.referenceDateISO, 'smoke_free'))}
        >
          <Text style={styles.primaryBtnText}>
            {progress.isTodayMarkedSmokeFree ? 'Marked Smoke-Free Today ✓' : 'Mark Today Smoke-Free'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          accessibilityRole="button"
          accessibilityLabel="Log a setback kindly without erasing progress"
          onPress={() =>
            setState((prev) => handleCompassionateSetback(prev, progress.referenceDateISO, 'log_and_keep_date').nextState)
          }
        >
          <Text style={styles.secondaryBtnText}>I Smoked — Log Kindly (Keep Past Progress)</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabRow}>
        {['today', 'images', 'benefits', 'milestones', 'help'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'today' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress &amp; Optional Estimates</Text>
          <Text style={styles.bodyText}>
            Milestones Achieved: {milestones.achievedCount} / {milestones.totalCount}
          </Text>
          <Text style={styles.bodyText}>{estimates.formulaExplanation}</Text>
        </View>
      )}

      {activeTab === 'images' && currentCard && (
        <View style={styles.card}>
          <Text style={styles.badge}>
            Image {(imageIdx % images.length) + 1} of {images.length} • {currentCard.visualCategoryBadge}
          </Text>
          <Text style={styles.sectionTitle}>{currentCard.title}</Text>
          <Text style={styles.bodyText}>{currentCard.educationalMessage}</Text>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setImageIdx((p) => p + 1)}
            >
              <Text style={styles.secondaryBtnText}>Skip Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setImageIdx((p) => p + 1)}
            >
              <Text style={styles.primaryBtnText}>View Next Image →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {activeTab === 'benefits' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Public-Health Benefits</Text>
          {BENEFIT_CARDS.map((b) => (
            <View key={b.id} style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: '700', color: '#0F5257' }}>{b.title}</Text>
              <Text style={styles.bodyText}>{b.summary}</Text>
              <Text style={styles.captionText}>Source: {b.sourceCitation}</Text>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'milestones' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Milestones &amp; Kudos</Text>
          {milestones.milestones.map((m) => (
            <View key={m.id} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '700' }}>
                {m.achieved ? '★ ' : '○ '} {m.title} ({m.daysRequired}d)
              </Text>
              <Text style={styles.bodyText}>{m.kudosMessage}</Text>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'help' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Get Help (No Location Tracking)</Text>
          {REGIONAL_HELP_RESOURCES[0].services.map((s) => (
            <View key={s.name} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '700' }}>{s.name}</Text>
              <Text style={styles.bodyText}>{s.phone} — {s.description}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.footerText}>
        {LEGAL_AND_PRICING_CONFIG.copyrightNotice} • {LEGAL_AND_PRICING_CONFIG.pricing.feeAndTaxDisclaimer}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  content: { padding: 16, gap: 14 },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0F5257',
    gap: 10
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBDCD9',
    gap: 8
  },
  badge: { fontSize: 12, fontWeight: '700', color: '#0F5257' },
  title: { fontSize: 24, fontWeight: '800', color: '#122628' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#122628' },
  subtitle: { fontSize: 14, color: '#3C5A5D' },
  bodyText: { fontSize: 14, color: '#122628', lineHeight: 20 },
  captionText: { fontSize: 12, color: '#587578' },
  primaryBtn: {
    backgroundColor: '#0F5257',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    backgroundColor: '#EAF2F0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  secondaryBtnText: { color: '#122628', fontWeight: '700', fontSize: 14 },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EAF2F0'
  },
  tabBtnActive: { backgroundColor: '#0F5257' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#122628' },
  tabTextActive: { color: '#FFFFFF' },
  footerText: { fontSize: 11, color: '#587578', textAlign: 'center', marginTop: 12 }
});
