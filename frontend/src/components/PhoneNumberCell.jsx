import { useState } from 'react';
import './PhoneNumberCell.css';

const PhoneNumberCell = ({ phoneNumber }) => {
  const [copied, setCopied] = useState(false);

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove any existing +91 or spaces, just return the number
    return phone.toString().replace(/^\+91\s*/, '').replace(/\s+/g, '');
  };

  const handleCopy = async () => {
    const formatted = formatPhoneNumber(phoneNumber);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formattedPhone = formatPhoneNumber(phoneNumber);

  return (
    <div className="phone-number-cell">
      <span className="phone-number-text">{formattedPhone}</span>
      <button 
        className="copy-button" 
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy phone number'}
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.333 2.667h8v8M10.667 2.667v-1.334a1.333 1.333 0 0 0-1.334-1.333H2.667a1.333 1.333 0 0 0-1.334 1.333v6.666a1.333 1.333 0 0 0 1.334 1.334h1.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.667 2.667h2.666v2.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default PhoneNumberCell;

