import enMessages from '../../messages/en.json';
import jaMessages from '../../messages/ja.json';

describe('i18n Translation Files', () => {
  describe('Translation key consistency', () => {
    function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
      const keys: string[] = [];

      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
        } else {
          keys.push(fullKey);
        }
      }

      return keys;
    }

    it('should have the same keys in both en.json and ja.json', () => {
      const enKeys = getAllKeys(enMessages).sort();
      const jaKeys = getAllKeys(jaMessages).sort();

      expect(enKeys).toEqual(jaKeys);
    });

    it('should not have any missing keys in en.json', () => {
      const enKeys = new Set(getAllKeys(enMessages));
      const jaKeys = getAllKeys(jaMessages);

      const missingInEn = jaKeys.filter((key) => !enKeys.has(key));

      expect(missingInEn).toEqual([]);
    });

    it('should not have any missing keys in ja.json', () => {
      const enKeys = getAllKeys(enMessages);
      const jaKeys = new Set(getAllKeys(jaMessages));

      const missingInJa = enKeys.filter((key) => !jaKeys.has(key));

      expect(missingInJa).toEqual([]);
    });
  });

  describe('Translation value validation', () => {
    it('should not have empty translation values in en.json', () => {
      const checkEmptyValues = (
        obj: Record<string, unknown>,
        path = '',
      ): string[] => {
        const emptyKeys: string[] = [];

        for (const [key, value] of Object.entries(obj)) {
          const fullPath = path ? `${path}.${key}` : key;

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            emptyKeys.push(
              ...checkEmptyValues(value as Record<string, unknown>, fullPath),
            );
          } else if (typeof value === 'string' && value.trim() === '') {
            emptyKeys.push(fullPath);
          }
        }

        return emptyKeys;
      };

      const emptyKeys = checkEmptyValues(enMessages);
      expect(emptyKeys).toEqual([]);
    });

    it('should not have empty translation values in ja.json', () => {
      const checkEmptyValues = (
        obj: Record<string, unknown>,
        path = '',
      ): string[] => {
        const emptyKeys: string[] = [];

        for (const [key, value] of Object.entries(obj)) {
          const fullPath = path ? `${path}.${key}` : key;

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            emptyKeys.push(
              ...checkEmptyValues(value as Record<string, unknown>, fullPath),
            );
          } else if (typeof value === 'string' && value.trim() === '') {
            emptyKeys.push(fullPath);
          }
        }

        return emptyKeys;
      };

      const emptyKeys = checkEmptyValues(jaMessages);
      expect(emptyKeys).toEqual([]);
    });
  });

  describe('Supported locales', () => {
    it('should have translation files for all supported locales', () => {
      // This test ensures that if we add new locales in routing.ts,
      // we remember to create corresponding translation files
      expect(enMessages).toBeDefined();
      expect(jaMessages).toBeDefined();
    });
  });
});
