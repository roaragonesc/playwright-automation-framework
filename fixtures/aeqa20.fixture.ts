import { readFile } from 'node:fs/promises';
import { test as uiTest, expect } from './ui.fixture';
import { ContactUsPage } from '../pages/ContactUsPage';
import { loadTestData, resolveTestDataPath } from '../test-data/loader';
import { validateAEQA20TestData } from '../test-data/validation';
import type { AEQA20TestData } from '../test-data/types';

type AEQA20Fixtures = {
  contactUs: ContactUsPage;
  contactData: AEQA20TestData;
  attachmentPath: string;
};

export const test = uiTest.extend<AEQA20Fixtures>({
  contactUs: async ({ page }, use) => { await use(new ContactUsPage(page)); },
  contactData: async ({}, use) => {
    const contactData = await loadTestData('contact/AEQA-20.json', validateAEQA20TestData);
    await use(contactData);
  },
  attachmentPath: async ({ contactData }, use) => {
    const attachmentPath = resolveTestDataPath(`contact/${contactData.attachment.fileName}`);
    const attachmentContent = await readFile(attachmentPath, 'utf8');
    if (attachmentContent !== contactData.attachment.content) {
      throw new Error('[TestData] AEQA-20 attachment content does not match the JSON definition.');
    }
    await use(attachmentPath);
  },
});

export { expect };