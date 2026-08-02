import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, Text } from 'react-native';

import { HOME_TAGLINE_PHRASES } from './homeTaglinePhrases';
import {
  TAGLINE_FADE_MS,
  TAGLINE_ROTATION_MS,
  useHomeTaglineCarouselStyles,
} from './HomeTaglineCarousel.styles';

function randomPhraseIndex() {
  return Math.floor(Math.random() * HOME_TAGLINE_PHRASES.length);
}

export function HomeTaglineCarousel() {
  const styles = useHomeTaglineCarouselStyles();
  const [phraseIndex, setPhraseIndex] = useState(randomPhraseIndex);
  const opacity = useRef(new Animated.Value(1)).current;
  const fadeOutRef = useRef<Animated.CompositeAnimation | null>(null);
  const fadeInRef = useRef<Animated.CompositeAnimation | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setAppActive(nextState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const active = isFocused && appActive;

  useEffect(() => {
    if (!active) {
      fadeOutRef.current?.stop();
      fadeInRef.current?.stop();
      opacity.setValue(1);
      return;
    }

    const interval = setInterval(() => {
      fadeOutRef.current?.stop();
      fadeInRef.current?.stop();

      const fadeOut = Animated.timing(opacity, {
        toValue: 0,
        duration: TAGLINE_FADE_MS,
        useNativeDriver: true,
      });
      fadeOutRef.current = fadeOut;

      fadeOut.start(({ finished }) => {
        if (!finished) {
          return;
        }

        setPhraseIndex((current) => (current + 1) % HOME_TAGLINE_PHRASES.length);

        const fadeIn = Animated.timing(opacity, {
          toValue: 1,
          duration: TAGLINE_FADE_MS,
          useNativeDriver: true,
        });
        fadeInRef.current = fadeIn;
        fadeIn.start();
      });
    }, TAGLINE_ROTATION_MS);

    return () => {
      clearInterval(interval);
      fadeOutRef.current?.stop();
      fadeInRef.current?.stop();
    };
  }, [active, opacity]);

  return (
    <Animated.Text
      accessibilityLiveRegion="polite"
      style={[styles.phrase, { opacity }]}
      numberOfLines={2}>
      {HOME_TAGLINE_PHRASES[phraseIndex]}
    </Animated.Text>
  );
}
