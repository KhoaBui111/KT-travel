import React from 'react';
import { BsMessenger } from 'react-icons/bs';
import './MessengerChat.css';

/**
 * MessengerChat Component - Icon chat Messenger cố định góc phải dưới
 * Gradient tím-hồng, hình tròn
 */
const MessengerChat = () => {
  const handleClick = () => {
    // Mở hộp thoại tin nhắn Messenger trực tiếp
    window.open('https://www.facebook.com/messages/e2ee/t/24189383700676233', '_blank', 'noopener,noreferrer');
  };

  return (
    <button className="messenger-chat" onClick={handleClick} title="Liên hệ Facebook với chúng tôi">
      <BsMessenger className="messenger-icon" />
    </button>
  );
};

export default MessengerChat;
