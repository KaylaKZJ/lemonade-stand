import React, { useEffect } from 'react';
import { useStore } from '../store';

const Toast: React.FC = () => {
  const { ui, hideToast } = useStore();

  useEffect(() => {
    if (ui.toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [ui.toast, hideToast]);

  if (!ui.toast) return null;

  return (
    <div
      className={`toast ${ui.toast.type}`}
      role='alert'
      aria-live='polite'
      onClick={hideToast}
    >
      {ui.toast.msg}
    </div>
  );
};

export default Toast;
