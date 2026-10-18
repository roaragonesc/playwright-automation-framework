import { qase } from 'playwright-qase-reporter';
import { test, expect } from '../../../../fixtures/aeqa20.fixture';

test(qase(20, 'AEQA-20 @regression - Submit Contact Form Successfully with File Attachment'), async ({
  home,
  contactUs,
  contactData,
  attachmentPath,
}) => {
  await test.step('1. Navigate to Automation Exercise and verify the homepage.', async () => {
    await home.open();
    await expect(home.page).toHaveURL(/\/$/);
    await expect(new URL(home.page.url()).origin).toBe(new URL(contactData.baseUrl).origin);
    await expect(home.homeLink).toBeVisible();
    await expect(home.contactUsLink).toBeVisible();
  });

  await test.step('2. Open Contact Us and verify the page heading.', async () => {
    await home.goToContactUs();
    await expect(contactUs.pageHeading).toBeVisible();
    expect((await contactUs.pageHeading.innerText()).trim().toUpperCase())
      .toBe(contactData.expected.pageHeading);
  });

  await test.step('3. Enter the contact name.', async () => {
    await contactUs.nameInput.fill(contactData.contactForm.name);
    await expect(contactUs.nameInput).toHaveValue(contactData.contactForm.name);
  });

  await test.step('4. Enter the contact email.', async () => {
    await contactUs.emailInput.fill(contactData.contactForm.email);
    await expect(contactUs.emailInput).toHaveValue(contactData.contactForm.email);
  });

  await test.step('5. Enter the contact subject.', async () => {
    await contactUs.subjectInput.fill(contactData.contactForm.subject);
    await expect(contactUs.subjectInput).toHaveValue(contactData.contactForm.subject);
  });

  await test.step('6. Enter the contact message.', async () => {
    await contactUs.messageInput.fill(contactData.contactForm.message);
    await expect(contactUs.messageInput).toHaveValue(contactData.contactForm.message);
  });

  await test.step('7. Attach the documented text file.', async () => {
    await contactUs.attachmentInput.setInputFiles(attachmentPath);
    expect(await contactUs.attachmentInput.inputValue()).toContain(contactData.attachment.fileName);
  });

  let confirmationDialog!: import('@playwright/test').Dialog;
  let submitPromise!: Promise<void>;

  await test.step('8. Submit the form and verify the browser confirmation dialog.', async () => {
    const dialogPromise = home.page.waitForEvent('dialog');
    submitPromise = contactUs.submitButton.click();
    confirmationDialog = await dialogPromise;
    expect(contactData.expected.confirmationDialog).toBe(true);
    expect(confirmationDialog.type()).toBe('confirm');
  });

  await test.step('9. Accept the confirmation dialog and verify submission success.', async () => {
    await confirmationDialog.accept();
    await submitPromise;
    await expect(contactUs.successMessage(contactData.expected.successMessage)).toBeVisible();
  });

  await test.step('10. Return Home and verify the homepage navigation.', async () => {
    await home.goToHome();
    await expect(home.page).toHaveURL(/\/$/);
    await expect(home.productsLink).toBeVisible();
    await expect(home.contactUsLink).toBeVisible();
    expect(contactData.expected.returnToHomepage).toBe(true);
  });
});