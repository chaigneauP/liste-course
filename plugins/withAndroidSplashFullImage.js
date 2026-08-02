const { withAndroidManifest, XML } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Android 12+ affiche l'icône de splash dans un cercle (effet « bulle »).
 * Ce plugin repasse au drawable plein écran (image centrée, sans rognage).
 *
 * Appliqué en phase `manifest` (après expo-splash-screen) pour ne pas être écrasé.
 */
function withAndroidSplashFullImage(config) {
  return withAndroidManifest(config, async (config) => {
    const stylesPath = path.join(
      config.modRequest.platformProjectRoot,
      'app/src/main/res/values/styles.xml'
    );

    if (!fs.existsSync(stylesPath)) {
      return config;
    }

    const styles = await XML.readXMLAsync({ path: stylesPath });
    const styleGroups = styles.resources.style ?? [];

    styles.resources.style = styleGroups.map((styleGroup) => {
      if (styleGroup.$?.name !== 'Theme.App.SplashScreen') {
        return styleGroup;
      }

      return {
        $: {
          name: 'Theme.App.SplashScreen',
          parent: 'AppTheme',
        },
        item: [
          {
            $: { name: 'android:windowBackground' },
            _: '@drawable/ic_launcher_background',
          },
        ],
      };
    });

    await XML.writeXMLAsync({ path: stylesPath, xml: styles });
    return config;
  });
}

module.exports = withAndroidSplashFullImage;
