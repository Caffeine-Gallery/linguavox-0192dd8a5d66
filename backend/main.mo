import Int "mo:base/Int";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";

actor {
    // Type definition for a translation record
    type Translation = {
        sourceText: Text;
        translatedText: Text;
        targetLanguage: Text;
        timestamp: Int;
    };

    // Stable variable to store translations
    stable var translations: [Translation] = [];

    // Store a new translation
    public func storeTranslation(sourceText: Text, translatedText: Text, targetLanguage: Text) : async () {
        let newTranslation: Translation = {
            sourceText = sourceText;
            translatedText = translatedText;
            targetLanguage = targetLanguage;
            timestamp = Time.now();
        };
        
        translations := Array.append<Translation>(translations, [newTranslation]);
    };

    // Get all translations
    public query func getTranslations() : async [Translation] {
        translations
    };

    // Get translations for a specific language
    public query func getTranslationsByLanguage(language: Text) : async [Translation] {
        Array.filter<Translation>(translations, func(t) { t.targetLanguage == language })
    };
}
