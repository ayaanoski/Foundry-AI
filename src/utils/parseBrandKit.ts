// Define the structure of our Brand Kit data
export interface BrandKitData {
  theme: string[];
  audience: string[];
  colors: { name: string; hex: string }[];
  voice: string[];
  taglines: string[];
  marketing: string[];
}

// A more robust helper to extract content using keywords
const extractSection = (text: string, keyword: string): string[] => {
  // This regex looks for a markdown header (## or ###) followed by any characters
  // up to the keyword, then captures everything until the next header or the end of the string.
  const regex = new RegExp(`#{2,3}\\s.*${keyword}[\\s\\S]*?((?=#{2,3})|$)`, 'i');
  const match = text.match(regex);
  if (!match) return [];

  // Clean up the content: remove header, split by lines, filter empty lines, and remove list markers
  return match[0]
    .replace(/#{2,3}\s.*$/m, '') // Remove the first line (the header)
    .split('\n')
    .map(line => line.replace(/^[\-\*•]\s*/, '').trim())
    .filter(line => line.length > 0);
};

// Helper to parse color lines specifically
const parseColors = (lines: string[]): { name: string; hex: string }[] => {
  const colorRegex = /([\w\s]+?):\s*(#[A-Fa-f0-9]{6})\b/i;
  return lines
    .map(line => {
      const match = line.match(colorRegex);
      if (match) {
        return { name: match[1].trim(), hex: match[2].trim() };
      }
      return null;
    })
    .filter((color): color is { name: string; hex: string } => color !== null);
};

// Main parsing function now uses keywords
export const parseBrandKit = (content: string): BrandKitData => {
  const themeLines = extractSection(content, 'THEME');
  const audienceLines = extractSection(content, 'AUDIENCE');
  const colorLines = extractSection(content, 'COLOR');
  const voiceLines = extractSection(content, 'VOICE');
  const taglineLines = extractSection(content, 'TAGLINE');
  const marketingLines = extractSection(content, 'MARKETING');

  return {
    theme: themeLines,
    audience: audienceLines,
    colors: parseColors(colorLines),
    voice: voiceLines,
    taglines: taglineLines,
    marketing: marketingLines,
  };
};