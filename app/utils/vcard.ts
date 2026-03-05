/**
 * Utility to generate vCard (VCF) format from profile data
 */
export const generateVCard = (profile: any) => {
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${profile.name}`,
        `N:;${profile.name};;;`,
        `NOTE:PoMatch Profile: ${profile.description}. MBTI: ${profile.persona?.mbti}, Zodiac: ${profile.persona?.zodiac}`,
        `URL:https://pomatch.com/${profile.username}`,
        `REV:${new Date().toISOString()}`,
        'END:VCARD'
    ];

    // Add social links as notes or separate URLs if needed
    if (profile.socialLinks && profile.socialLinks.length > 0) {
        profile.socialLinks.forEach((link: any) => {
            lines.splice(lines.length - 1, 0, `X-SOCIALPROFILE;TYPE=${link.platform}:${link.url || ''}`);
        });
    }

    return lines.join('\r\n');
};

export const downloadVCard = (profile: any) => {
    const vcard = generateVCard(profile);
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.username || 'profile'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
