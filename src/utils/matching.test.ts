import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchScore } from './matching.ts';
import { evaluateLocalSafeguardRules } from './safeguardRules.ts';

test('calculateMatchScore produces higher score for aligned categories and skills', () => {
  const user = {
    targetCategories: ['Jobs', 'Remote Work'],
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    workPreference: 'remote',
  };

  const highMatchOpp = {
    title: 'Senior Frontend Engineer',
    category: 'Jobs',
    workType: 'Remote',
    requiredSkills: ['React', 'TypeScript'],
  };

  const result = calculateMatchScore(user, highMatchOpp);
  assert.ok(result.score >= 70, `Expected score >= 70, got ${result.score}`);
  assert.ok(result.fitLevel === 'Strong Match' || result.fitLevel === 'Exceptional Match');
  assert.ok(result.metRequirements.length > 0);
});

test('calculateMatchScore gracefully handles empty user profile', () => {
  const result = calculateMatchScore({}, {
    title: 'General Fellowship',
    category: 'Scholarships',
  });
  assert.ok(result.score >= 15 && result.score <= 98);
  assert.ok(typeof result.recommendationNote === 'string');
});

test('evaluateLocalSafeguardRules detects upfront fee red flag', () => {
  const fraudulentAdvert = 'Urgent hiring for Amazon data entry! Registration fee of $50 required to process your application badge.';
  const result = evaluateLocalSafeguardRules(fraudulentAdvert);

  assert.equal(result.riskLevel, 'suspicious');
  assert.ok(result.redFlags.some((f) => f.includes('fee')));
  assert.ok(result.riskScore > 30);
});

test('evaluateLocalSafeguardRules flags multiple red flags as high_risk', () => {
  const severeScam = 'Earn $1000 daily with no experience! Pay registration fee now. WhatsApp only +2348000000000. Send bank PIN to verify.';
  const result = evaluateLocalSafeguardRules(severeScam);

  assert.equal(result.riskLevel, 'high_risk');
  assert.ok(result.redFlags.length >= 2);
  assert.ok(result.riskScore >= 60);
});

test('evaluateLocalSafeguardRules recognizes trusted official domain', () => {
  const legitListing = 'Apply for the 2026 Chevening Scholarship to study in the UK.';
  const legitUrl = 'https://www.chevening.org/scholarships';
  const result = evaluateLocalSafeguardRules(legitListing, legitUrl);

  assert.equal(result.riskLevel, 'verified');
  assert.equal(result.redFlags.length, 0);
  assert.ok(result.positiveIndicators.length > 0);
});
