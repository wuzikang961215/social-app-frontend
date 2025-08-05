import React from 'react';

/**
 * Converts URLs in text to clickable links
 */
export function linkifyText(text: string): React.ReactNode[] {
  // More precise regex that captures full URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  let lastIndex = 0;
  const result: React.ReactNode[] = [];
  let match;
  let keyIndex = 0;
  
  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }
    
    // Add the URL as a link
    const url = match[0];
    result.push(
      <a
        key={`link-${keyIndex++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last URL
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  
  // If no URLs were found, return the original text
  if (result.length === 0) {
    return [text];
  }
  
  return result;
}

/**
 * Component that renders text with clickable links
 */
export function Linkify({ children }: { children: string }) {
  return <>{linkifyText(children)}</>;
}