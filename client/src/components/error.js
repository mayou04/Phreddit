import { useEffect } from 'react';

function Error({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Automatically close after 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <div className="error-message displayed">
      {message}
    </div>
  );
}

export default Error;