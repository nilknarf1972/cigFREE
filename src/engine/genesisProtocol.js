/**
 * Clear Path (cigFREE) — Genesis Protocol Runtime & Trust Ledger
 * © 2026 The Primo IT Tech LLC. All Rights Reserved.
 */

import { LEGAL_AND_PRICING_CONFIG } from '../data/clearPathData.js';

export const GENESIS_PROTOCOL_REGISTRY = {
  protocolName: 'DreamNet Genesis Protocol',
  canonicalVersion: '1.0.0',
  canonicalCommit: 'ef0c1e6a',
  systemName: 'Clear Path (cigFREE)',
  ownerEntity: LEGAL_AND_PRICING_CONFIG.companyName,
  managingMember: LEGAL_AND_PRICING_CONFIG.managingMember,
  copyright: LEGAL_AND_PRICING_CONFIG.copyrightNotice,
  pillars: {
    seed: {
      name: '1. The Seed (Dream Kernel)',
      principle: 'Every smoke-free hour is a victory kept forever.',
      status: 'active'
    },
    microcosm: {
      name: '2. The Microcosm (Subterranean Layer)',
      modules: [
        'src/engine/clearPathEngine.js',
        'src/engine/genesisProtocol.js',
        'src/data/clearPathData.js'
      ],
      status: 'active'
    },
    breakthrough: {
      name: '3. The Breakthrough (First Emergence)',
      bridges: [
        'Offline PWA Service Worker (public/sw.js)',
        'iOS & Android Expo App Store Bundle (mobile/app.json)',
        'Local-First Storage (localStorage / AsyncStorage)'
      ],
      status: 'active'
    },
    firstTree: {
      name: '4. The First Tree (Connectivity Engine)',
      screens: [
        'Welcome / Onboarding',
        'Today',
        'Image Journey',
        'Benefits',
        'Calendar',
        'Milestones',
        'Settings',
        'Get Help'
      ],
      status: 'active'
    },
    cityWorldRealms: {
      name: '5. The City, the World, the Realms (Trust Ledger)',
      ledgers: [
        'Image Rights, Source & Subject Consent Ledger',
        'Pre-Release Medical Reviewer Sign-Off Audit Ledger',
        'Store Pricing Transparency Ledger ($0.99 One-Time Download)'
      ],
      status: 'active'
    },
    livingSystem: {
      name: '6. The Living System',
      capabilities: [
        'Adaptive Visual Intensity (Gentle, Direct with Warning, Hide Graphic)',
        'Compassionate Setback Recovery (Non-Erasing Progress)',
        'Accessibility Suite (Light/Dark/System, Scalable Text, High Contrast, Reduced Motion)'
      ],
      status: 'active'
    }
  }
};
