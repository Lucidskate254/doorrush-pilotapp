
import { useState, useEffect, useRef } from 'react';

interface UseCaptchaOptions {
  onTokenChange?: (token: string | null) => void;
}

export const useCaptcha = (options?: UseCaptchaOptions) => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);

  const handleTokenChange = (token: string | null) => {
    setCaptchaToken(token);
    options?.onTokenChange?.(token);
  };

  useEffect(() => {
    // Load CAPTCHA script when component mounts
    const loadCaptchaScript = () => {
      if (window.turnstile) {
        renderCaptcha();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => renderCaptcha();
      document.head.appendChild(script);
    };

    loadCaptchaScript();

    return () => {
      // Clean up on unmount if needed
      if (widgetId && window.turnstile) {
        window.turnstile.reset(widgetId);
      }
    };
  }, []);

  const renderCaptcha = () => {
    if (!captchaRef.current || !window.turnstile) return;

    const id = window.turnstile.render(captchaRef.current, {
      sitekey: "0x4AAAAAAAFF14mVA6pRk7b", // Cloudflare Turnstile Supabase site key
      callback: function(token: string) {
        handleTokenChange(token);
      },
      "expired-callback": function() {
        handleTokenChange(null);
      }
    });
    
    setWidgetId(id);
  };

  const resetCaptcha = () => {
    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId);
      handleTokenChange(null);
    }
  };

  return {
    captchaRef,
    captchaToken,
    resetCaptcha
  };
};

export default useCaptcha;
