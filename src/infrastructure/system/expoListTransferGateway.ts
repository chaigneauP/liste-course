import { Directory, File, Paths } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

import type { ListTransferGateway } from '@/domain/ports/listTransferGateway';

function isPickerCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return /cancel+ed/i.test(error.message);
}

function basenameWithoutExtension(filename: string): string {
  return filename.replace(/\.json$/i, '');
}

/**
 * Adaptateur Expo : écriture cache + Sharing pour l’export,
 * sélecteur de dossier pour le téléchargement,
 * DocumentPicker + lecture fichier pour l’import.
 */
export function createExpoListTransferGateway(): ListTransferGateway {
  return {
    async shareJsonFile(filename, contents) {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        throw new Error('Sharing is not available on this device');
      }

      const file = new File(Paths.cache, filename);
      file.create({ overwrite: true });
      file.write(contents);

      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Partager la liste',
        UTI: 'public.json',
      });
    },

    async saveJsonFile(filename, contents) {
      try {
        const directory = await Directory.pickDirectoryAsync();
        const file = directory.createFile(basenameWithoutExtension(filename), 'application/json');
        file.write(contents);
        return 'saved';
      } catch (error) {
        if (isPickerCancelled(error)) {
          return 'cancelled';
        }
        throw error;
      }
    },

    async pickJsonFileContents() {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/json', 'text/plain'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const file = new File(asset.uri);
      return file.text();
    },
  };
}
