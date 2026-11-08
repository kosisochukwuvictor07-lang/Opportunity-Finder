export interface UserProfileMatchData {
  country?: string;
  highestEducation?: string;
  experienceLevel?: string;
  workPreference?: string; // 'remote' | 'physical' | 'hybrid' | 'any'
  skills?: string[];
  targetCategories?: string[];
}

export interface OpportunityMatchData {
  id?: string;
  title: string;
  category: string;
  location?: string;
  workType?: string; // 'Remote' | 'On-site' | 'Hybrid'
  requiredQualifications?: string[];
  requiredSkills?: string[];
}

export interface MatchResult {
  score: number;
  fitLevel: 'Exceptional Match' | 'Strong Match' | 'Moderate Match' | 'Low Match';
  metRequirements: string[];
  missingRequirements: string[];
  recommendationNote: string;
}

const EDUCATION_LEVELS: Record<string, number> = {
  'No formal qualification': 1,
  'Primary education': 2,
  'Secondary education': 3,
  'Diploma': 4,
  'Undergraduate': 5,
  'Graduate': 6,
  'Postgraduate': 7,
};

const EXPERIENCE_LEVELS: Record<string, number> = {
  'No experience': 0,
  'Beginner': 0.5,
  'Less than one year': 1,
  '1–3 years': 2,
  '3–5 years': 4,
  'More than five years': 6,
};

export function calculateMatchScore(
  user: UserProfileMatchData,
  opportunity: OpportunityMatchData
): MatchResult {
  let score = 30; // Baseline exploration score
  const met: string[] = [];
  const missing: string[] = [];

  // 1. Category alignment (25 points)
  if (user.targetCategories && user.targetCategories.length > 0) {
    const oppCat = opportunity.category.toLowerCase();
    const hasCategory = user.targetCategories.some(
      (c) => oppCat.includes(c.toLowerCase()) || c.toLowerCase().includes(oppCat)
    );
    if (hasCategory) {
      score += 25;
      met.push(`Target opportunity category matches: ${opportunity.category}`);
    } else {
      missing.push(`Different from your selected primary categories`);
    }
  } else {
    score += 15;
  }

  // 2. Skills overlap (30 points)
  const reqSkills = opportunity.requiredSkills || [];
  const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());

  if (reqSkills.length > 0) {
    const matchedSkills = reqSkills.filter((r) =>
      userSkills.some((u) => u.includes(r.toLowerCase()) || r.toLowerCase().includes(u))
    );
    const unMatchedSkills = reqSkills.filter(
      (r) => !userSkills.some((u) => u.includes(r.toLowerCase()) || r.toLowerCase().includes(u))
    );

    const matchRatio = matchedSkills.length / reqSkills.length;
    score += Math.round(matchRatio * 30);

    if (matchedSkills.length > 0) {
      met.push(`Skills verified: ${matchedSkills.slice(0, 3).join(', ')}`);
    }
    if (unMatchedSkills.length > 0) {
      missing.push(`Skills to strengthen: ${unMatchedSkills.slice(0, 3).join(', ')}`);
    }
  } else {
    score += 20;
    met.push('Open to all skill levels');
  }

  // 3. Work preference / Remote compatibility (15 points)
  const oppWorkType = (opportunity.workType || '').toLowerCase();
  const userPref = (user.workPreference || '').toLowerCase();

  if (userPref && oppWorkType) {
    if (userPref.includes('remote') && oppWorkType.includes('remote')) {
      score += 15;
      met.push('100% Remote flexibility matched');
    } else if (userPref.includes('hybrid') || oppWorkType.includes('hybrid')) {
      score += 10;
      met.push('Flexible work arrangement');
    } else if (userPref.includes('physical') && oppWorkType.includes('on-site')) {
      score += 15;
      met.push('On-site preference matches opportunity format');
    } else {
      score += 5;
    }
  } else {
    score += 10;
  }

  // Bound score between 15 and 98 (honest: never 100% guarantee)
  const finalScore = Math.min(98, Math.max(15, score));

  let fitLevel: MatchResult['fitLevel'] = 'Moderate Match';
  if (finalScore >= 80) fitLevel = 'Exceptional Match';
  else if (finalScore >= 65) fitLevel = 'Strong Match';
  else if (finalScore >= 45) fitLevel = 'Moderate Match';
  else fitLevel = 'Low Match';

  const recommendationNote =
    finalScore >= 75
      ? 'Your current profile is highly competitive for this role. Prepare your application materials and review the official requirements.'
      : finalScore >= 50
      ? 'Good baseline fit. Review the required skills and consider highlighting transferable achievements in your CV.'
      : 'Review the eligibility criteria carefully. You may need to build additional experience or prerequisite skills.';

  return {
    score: finalScore,
    fitLevel,
    metRequirements: met,
    missingRequirements: missing,
    recommendationNote,
  };
}
