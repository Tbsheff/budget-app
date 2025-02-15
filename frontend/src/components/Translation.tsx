import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (config: object, id: string) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

const TranslationWidget = () => {
  useEffect(() => {
    // ✅ Detect user's browser language
    const browserLanguage = navigator.language.split("-")[0];
    console.log("User's detected language:", navigator.language);
    console.log("Using base language for translation:", browserLanguage);

    // ✅ Supported languages (Modify as needed)
    const supportedLanguages = ["es", "fr", "de", "zh", "ar", "hi"];

    if (supportedLanguages.includes(browserLanguage)) {
      console.log(`Auto-translating page to: ${browserLanguage}`);

      window.googleTranslateElementInit = () => {
        new window.google!.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: supportedLanguages.join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // ✅ Apply translation and continuously remove UI elements
        setTimeout(() => {
          const select = document.querySelector(
            ".goog-te-combo"
          ) as HTMLSelectElement;
          if (select) {
            select.value = browserLanguage;
            select.dispatchEvent(new Event("change"));
            console.log(
              `✅ Successfully set translation to: ${browserLanguage}`
            );
          } else {
            console.error("❌ Google Translate dropdown not found!");
          }

          // ✅ Function to remove Google Translate UI elements
          const removeGoogleTranslateUI = () => {
            document
              .querySelectorAll(
                ".goog-te-banner-frame, .goog-te-gadget, .goog-te-combo, .VIpgJd-ZVi9od-xl07Ob-lTBxed, .goog-te-spinner-pos"
              )
              .forEach((el) => el.remove());

            const googleFrame = document.querySelector(
              "iframe.goog-te-banner-frame"
            );
            if (googleFrame) googleFrame.remove();

            document.body.style.top = "0px"; // Prevents layout shift from banner
            console.log("✅ Google Translate UI Removed Successfully!");
          };

          // ✅ Use MutationObserver to continuously remove elements Google reinserts
          const observer = new MutationObserver(() =>
            removeGoogleTranslateUI()
          );
          observer.observe(document.body, { childList: true, subtree: true });

          // Initial cleanup
          removeGoogleTranslateUI();
        }, 2000);
      };

      // ✅ Inject Google Translate script dynamically
      const addGoogleTranslateScript = () => {
        if (!document.getElementById("google-translate-script")) {
          const script = document.createElement("script");
          script.id = "google-translate-script";
          script.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
          script.async = true;
          script.defer = true;
          script.onload = () =>
            console.log("✅ Google Translate script loaded!");
          document.body.appendChild(script);
        }
      };

      addGoogleTranslateScript();
    } else {
      console.log("No translation needed for this language.");
    }
  }, []);

  return (
    <>
      {/* ✅ Hide Google Translate UI with CSS */}
      <style>
        {`
          .goog-te-banner-frame, .goog-te-gadget, .goog-te-combo, .VIpgJd-ZVi9od-xl07Ob-lTBxed, .goog-te-spinner-pos {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            height: 0 !important;
            width: 0 !important;
            pointer-events: none !important;
          }

          body { top: 0px !important; } /* Prevents layout shift */
          iframe.goog-te-banner-frame { display: none !important; }

          .skiptranslate > iframe { 
  height: 0 !important;
  border-style: none;
  box-shadow: none;
        }
  .VIpgJd-ZVi9od-ORHb-OEVmcd skiptranslate{
  display: none !important;
    height: 0 !important;
  border-style: none;
  box-shadow: none;
  }

        `}
      </style>
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
};

export default TranslationWidget;
