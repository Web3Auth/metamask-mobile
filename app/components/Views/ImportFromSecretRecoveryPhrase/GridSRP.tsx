import {
  View,
  TextInput,
  Platform,
  FlatList,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from 'react-native';
import Text, {
  TextColor,
  TextVariant,
} from '../../../component-library/components/Texts/Text';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTheme } from '../../../util/theme';
import { strings } from '../../../../locales/i18n';
import createStyles from './styles';
import Button, {
  ButtonVariants,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import TextField from '../../../component-library/components/Form/TextField/TextField';
import { TextFieldSize } from '../../../component-library/components/Form/TextField';
import { wordlist } from '@metamask/scure-bip39/dist/wordlists/english';

// interface ListOfTextFieldRefs {
//   [index: number]: TextInput;
// }
const SPACE_CHAR = ' ';
const GridSRP = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const seedPhraseInputRefs = useRef<TextInput[]>([]);

  const [error, setError] = useState('');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [seedPhraseInputFocusedIndex, setSeedPhraseInputFocusedIndex] =
    useState(0);
  const [nextSeedPhraseInputFocusedIndex, setNextSeedPhraseInputFocusedIndex] =
    useState(0);
  const [showAllSeedPhrase, setShowAllSeedPhrase] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const inputPadding = Platform.OS === 'ios' ? 4 : 3;
  const numColumns = 3; // Number of columns

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const checkValidSeedWord = useCallback(
    (text: string) => wordlist.includes(text),
    [],
  );

  const [isAnyWordError, setIsAnyNewWordError] = useState(false);

  const handleClear = useCallback(() => {
    setSeedPhrase([]);
    setShowAllSeedPhrase(false);
    setError('');
  }, []);

  const handleSeedPhraseChange = useCallback(
    (text: string, index: number) => {
      if (text.includes(SPACE_CHAR)) {
        const isEndWithSpace = text.at(-1) === SPACE_CHAR;
        // handle use pasting multiple words / whole seed phrase separated by spaces
        const splitArray = text.trim().split(' ');

        if (splitArray.length > 0) {
          const isAllValid = splitArray.reduce(
            (acc, item) => acc && checkValidSeedWord(item),
            true,
          );

          if (!isAllValid) {
            setError(strings('import_from_seed.spellcheck_error'));
          } else {
            setError('');
          }
        }

        setSeedPhrase((prev) => {
          const endSlices = prev.slice(index + 1);
          if (endSlices.length === 0 && isEndWithSpace) {
            endSlices.push('');
          }
          return [...prev.slice(0, index), ...splitArray, ...endSlices];
          // input the array into the correct index
        });

        setNextSeedPhraseInputFocusedIndex(index + 1);
      } else {
        setSeedPhrase((prev) => {
          // update the word at the correct index
          const newSeedPhrase = [...prev];
          newSeedPhrase[index] = text.trim();
          return newSeedPhrase;
        });
      }
    },
    [
      setError,
      setSeedPhrase,
      checkValidSeedWord,
      setNextSeedPhraseInputFocusedIndex,
    ],
  );

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const { key } = e.nativeEvent;
    if (key === 'Backspace') {
      if (seedPhrase[index] === '') {
        const newData = seedPhrase.filter((_, idx) => idx !== index);
        setSeedPhrase(newData);
        if (index > 0) {
          setNextSeedPhraseInputFocusedIndex(index - 1);
        }
      }
      return;
    }
  };

  const handlePaste = useCallback(
    async (focusedIndex: number) => {
      const text = await Clipboard.getString(); // Get copied text
      if (text.trim() !== '') {
        handleSeedPhraseChange(text, focusedIndex);
      }
    },
    [handleSeedPhraseChange],
  );

  const toggleShowAllSeedPhrase = () => {
    setShowAllSeedPhrase((prev) => !prev);
  };

  useEffect(() => {
    console.log(
      'nextSeedPhraseInputFocusedIndex',
      nextSeedPhraseInputFocusedIndex,
    );
    console.log(
      'seedPhraseInputRefs',
      seedPhraseInputRefs.current[nextSeedPhraseInputFocusedIndex]?.focus,
    );
    seedPhraseInputRefs.current[nextSeedPhraseInputFocusedIndex]?.focus();
  }, [nextSeedPhraseInputFocusedIndex]);

  const handleOnFocus = useCallback(
    (index: number) => {
      if (seedPhraseInputFocusedIndex !== index) {
        setError('');
        const focusOutWord = seedPhrase[seedPhraseInputFocusedIndex];

        if (
          isAnyWordError ||
          (focusOutWord && !checkValidSeedWord(focusOutWord))
        ) {
          setIsAnyNewWordError(false);
          setError(strings('import_from_seed.spellcheck_error'));
        }
      }
      setSeedPhraseInputFocusedIndex(index);
    },
    [
      seedPhrase,
      seedPhraseInputFocusedIndex,
      setError,
      isAnyWordError,
      checkValidSeedWord,
      setSeedPhraseInputFocusedIndex,
    ],
  );

  return (
    <View style={styles.seedPhraseRoot}>
      <View style={styles.seedPhraseContainer}>
        <View style={styles.seedPhraseInnerContainer}>
          {seedPhrase.length <= 1 ? (
            <TextInput
              ref={(ref) => {
                if (ref) {
                  seedPhraseInputRefs.current[0] = ref;
                }
              }}
              textAlignVertical="top"
              placeholder={strings('import_from_seed.srp_placeholder')}
              value={seedPhrase?.[0] || ''}
              onChangeText={(text) => handleSeedPhraseChange(text, 0)}
              style={styles.seedPhraseDefaultInput}
              placeholderTextColor={colors.text.alternative}
              multiline
              autoFocus
              onKeyPress={(e) => handleKeyPress(e, 0)}
              autoComplete="off"
              blurOnSubmit={false}
              autoCapitalize="none"
            />
          ) : (
            <View
              style={[styles.seedPhraseInputContainer]}
              onLayout={handleLayout}
            >
              <FlatList
                data={seedPhrase}
                numColumns={numColumns}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      {
                        width: containerWidth / 3,
                        padding: inputPadding,
                      },
                    ]}
                  >
                    <TextField
                      ref={(ref) => {
                        if (ref) {
                          seedPhraseInputRefs.current[index] = ref;
                        }
                      }}
                      startAccessory={
                        <Text
                          variant={TextVariant.BodyMD}
                          color={TextColor.Alternative}
                          style={styles.inputIndex}
                        >
                          {index + 1}.
                        </Text>
                      }
                      value={item}
                      secureTextEntry={
                        checkValidSeedWord(item) &&
                        (showAllSeedPhrase
                          ? false
                          : seedPhraseInputFocusedIndex !== index)
                      }
                      onFocus={() => {
                        handleOnFocus(index);
                      }}
                      onChangeText={(text) =>
                        handleSeedPhraseChange(text, index)
                      }
                      placeholderTextColor={colors.text.muted}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      size={TextFieldSize.Md}
                      style={[styles.input]}
                      autoComplete="off"
                      textAlignVertical="center"
                      showSoftInputOnFocus
                      isError={!checkValidSeedWord(item)}
                      autoCapitalize="none"
                      numberOfLines={1}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </View>
        <View style={styles.seedPhraseContainerCta}>
          <Button
            variant={ButtonVariants.Link}
            style={styles.pasteButton}
            onPress={toggleShowAllSeedPhrase}
            label={
              showAllSeedPhrase
                ? strings('import_from_seed.hide_all')
                : strings('import_from_seed.show_all')
            }
            width={ButtonWidthTypes.Full}
          />
          <Button
            label={
              seedPhrase.length > 1
                ? strings('import_from_seed.clear_all')
                : strings('import_from_seed.paste')
            }
            variant={ButtonVariants.Link}
            style={styles.pasteButton}
            onPress={() => {
              if (seedPhrase.length > 1) {
                handleClear();
              } else {
                handlePaste(seedPhraseInputFocusedIndex);
              }
            }}
            width={ButtonWidthTypes.Full}
          />
        </View>
      </View>
      {error !== '' && (
        <Text variant={TextVariant.BodySMMedium} color={TextColor.Error}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default GridSRP;
