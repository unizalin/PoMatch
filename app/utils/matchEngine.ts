/**
 * PoMatch Engine - Core Compatibility Logic
 */

interface Persona {
    mbti: string;
    zodiac: string;
    tags: string[];
}

const MBTI_COMPATIBILITY: Record<string, string[]> = {
    'INFP': ['ENFJ', 'ENTJ', 'INFP', 'ENFP', 'INFJ'],
    'ENFJ': ['INFP', 'ISFP', 'ENFJ', 'ENFP', 'INFJ'],
    'INFJ': ['ENFP', 'ENTP', 'INFJ', 'ENFJ', 'INFP'],
    'ENFP': ['INFJ', 'INTJ', 'ENFP', 'ENFJ', 'INFP'],
    'INTJ': ['ENFP', 'ENTP', 'INTJ', 'INFJ', 'ENFP'],
    'ENTJ': ['INFP', 'INTP', 'ENTJ', 'ENFJ', 'INTJ'],
    'INTP': ['ENTJ', 'ESTJ', 'INTP', 'ENTP', 'INTJ'],
    'ENTP': ['INFJ', 'INTJ', 'ENTP', 'ENFP', 'INTP'],
    'ISFP': ['ENFJ', 'ESFJ', 'ESTJ', 'ISFP', 'ESFP'],
    'ESFJ': ['ISFP', 'ISTP', 'ESFJ', 'ENFJ', 'ISFP'],
    'ISTP': ['ESFJ', 'ESTJ', 'ISTP', 'ISFP', 'ESTP'],
    'ESTJ': ['INTP', 'ISFP', 'ISTP', 'ESFJ', 'ESTJ'],
    'ISFJ': ['ESFP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ'],
    'ESFP': ['ISFJ', 'ISTJ', 'ESFP', 'ISFP', 'ESFJ'],
    'ISTJ': ['ESFP', 'ESTP', 'ISTJ', 'ISFJ', 'ESTJ'],
    'ESTP': ['ISFJ', 'ISTJ', 'ESTP', 'ESFP', 'ISTP'],
};

const ZODIAC_ELEMENTS: Record<string, string> = {
    '牡羊座': 'Fire', '獅子座': 'Fire', '射手座': 'Fire',
    '金牛座': 'Earth', '處女座': 'Earth', '魔羯座': 'Earth',
    '雙子座': 'Air', '天秤座': 'Air', '水瓶座': 'Air',
    '巨蟹座': 'Water', '天蠍座': 'Water', '雙魚座': 'Water',
};

export const calculateMatchScore = (p1: Persona, p2: Persona): number => {
    let score = 50; // Base score

    // 1. MBTI Boost (30%)
    const p1MbtiBest = MBTI_COMPATIBILITY[p1.mbti.toUpperCase()] || [];
    if (p1MbtiBest.includes(p2.mbti.toUpperCase())) {
        score += 20;
    } else if (p1.mbti.toUpperCase() === p2.mbti.toUpperCase()) {
        score += 10;
    }

    // 2. Zodiac Boost (20%)
    const e1 = ZODIAC_ELEMENTS[p1.zodiac];
    const e2 = ZODIAC_ELEMENTS[p2.zodiac];
    if (e1 && e2) {
        if (e1 === e2) score += 15;
        else if ((e1 === 'Fire' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Fire')) score += 10;
        else if ((e1 === 'Earth' && e2 === 'Water') || (e1 === 'Water' && e2 === 'Earth')) score += 10;
    }

    // 3. Tags Similarity (20%)
    const commonTags = p1.tags.filter(tag => p2.tags.includes(tag));
    score += Math.min(commonTags.length * 5, 20);

    return Math.min(Math.round(score), 100);
};
