export const idlFactory = ({ IDL }) => {
  const Translation = IDL.Record({
    'sourceText' : IDL.Text,
    'targetLanguage' : IDL.Text,
    'translatedText' : IDL.Text,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'getTranslations' : IDL.Func([], [IDL.Vec(Translation)], ['query']),
    'getTranslationsByLanguage' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Translation)],
        ['query'],
      ),
    'storeTranslation' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
