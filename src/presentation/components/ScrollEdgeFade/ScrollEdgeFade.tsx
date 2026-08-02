import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { useScrollEdgeFadeStyles } from './ScrollEdgeFade.styles';

type Props = {
  /** Affiche le fondu (contenu débordant, pas encore en bas). */
  visible: boolean;
  /** Couleur de fond vers laquelle le dégradé aboutit (ex. `colors.bg`). */
  color: string;
};

export function ScrollEdgeFade({ visible, color }: Props) {
  const styles = useScrollEdgeFadeStyles();
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    });
    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity, visible]);

  return (
    <Animated.View pointerEvents="none" style={[styles.fade, { opacity }]}>
      <LinearGradient
        colors={['transparent', color]}
        locations={[0, 1]}
        style={styles.gradient}
      />
    </Animated.View>
  );
}
