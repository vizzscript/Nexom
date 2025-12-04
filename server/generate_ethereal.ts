import nodemailer from 'nodemailer';

async function main() {
    const testAccount = await nodemailer.createTestAccount();

    console.log('Ethereal Email Credentials:');
    console.log('---------------------------');
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log('---------------------------');
}

main().catch(console.error);
