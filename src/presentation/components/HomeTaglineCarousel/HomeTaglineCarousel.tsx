import { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';

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

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: TAGLINE_FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) {
          return;
        }

        setPhraseIndex((current) => (current + 1) % HOME_TAGLINE_PHRASES.length);

        Animated.timing(opacity, {
          toValue: 1,
          duration: TAGLINE_FADE_MS,
          useNativeDriver: true,
        }).start();
      });
    }, TAGLINE_ROTATION_MS);

    return () => clearInterval(interval);
  }, [opacity]);

  return (
    <Animated.Text
      accessibilityLiveRegion="polite"
      style={[styles.phrase, { opacity }]}
      numberOfLines={2}>
      {HOME_TAGLINE_PHRASES[phraseIndex]}
    </Animated.Text>
  );
}
