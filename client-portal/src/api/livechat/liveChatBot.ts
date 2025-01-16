
interface LiveChatWidgetFunctions {
    _h: ((...args: any[]) => void) | null;
    _q: any[];
    _v: string;
  on: (...args: any[]) => void;
  once: (...args: any[]) => void;
  off: (...args: any[]) => void;
  get: (...args: any[]) => any;
  call: (...args: any[]) => void;
  init: () => void;
}

export const initializeLiveChat = () => {
      window.__lc = window.__lc || {};
      window.__lc.license = 18342018;
      window.__lc.integration_name = 'manual_onboarding';
      window.__lc.product_name = 'livechat';

      (function(n: Window, t: Document) {
        function i(n: any[]) {
          return e._h ? e._h.apply(null, n) : e._q.push(n);
        }
        const e: LiveChatWidgetFunctions = {
          _q: [],
          _h: null,
          _v: '2.0',
          on: function () {
            i(['on', ...Array.from(arguments)]);
          },
          once: function () {
            i(['once', ...Array.from(arguments)]);
          },
          off: function () {
            i(['off', ...Array.from(arguments)]);
          },
          get: function () {
            if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
            return i(['get', ...Array.from(arguments)]);
          },
          call: function () {
            i(['call', ...Array.from(arguments)]);
          },
          init: function () {
            const script = t.createElement('script');
            script.async = true;
            script.type = 'text/javascript';
            script.src = 'https://cdn.livechatinc.com/tracking.js';
            t.head.appendChild(script);
          },
        };
        !n.__lc?.asyncInit && e.init();
        n.LiveChatWidget = n.LiveChatWidget || e;
      })(window, document);




};

