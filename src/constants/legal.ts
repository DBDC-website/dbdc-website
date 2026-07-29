import { contactInfo } from '@/constants/site';

export const PICS_SHORT =
  'Personal Information Collection Statement (PICS): The Diocesan Building and Development Commission (DBDC) of the Catholic Diocese of Hong Kong may collect personal and confidential information you provide through this website (including consultant and contractor registration forms) for purposes relating to our building and development services. Data will be used only for the stated purposes and handled in accordance with the Personal Data (Privacy) Ordinance.';

export const PICS_LINK_LABEL = 'Read full Personal Information Collection Statement';

const CONTACT_EMAIL = contactInfo.email;

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalPageContentData = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export const copyrightDisclaimerContent: LegalPageContentData = {
  title: 'Copyright & Disclaimer',
  description:
    'Ownership of this website’s content and the terms that apply when you use it.',
  sections: [
    {
      heading: 'Copyright Statement',
      paragraphs: [
        'This website and its content are owned by the Catholic Diocese of Hong Kong and are copyright protected under the Copyright Ordinance of the Hong Kong Special Administrative Region. Unless a prior written permission of the Catholic Diocese of Hong Kong is obtained, no person may download, reproduce, redistribute or publish part of or whole of the website content in any form or media whatsoever.',
        'Should there be any inconsistency between the English and Chinese versions of this Copyright Statement, the English version prevails.',
      ],
    },
    {
      heading: 'Disclaimer Statement',
      paragraphs: [
        'Unless it is expressly indicated otherwise, the Catholic Diocese of Hong Kong provides the content on this website for general information purpose only and on an ‘AS IS’ basis without any express or implied warranty of the accuracy, reliability, timeliness of the content on this website. Although we have made every effort to protect our website from the attacks of computer virus, malicious malware, and the like and theft of personal data, we shall not be held responsible for any damage, loss or destruction whatsoever arising from such attacks.',
        'The Catholic Diocese of Hong Kong shall not bear any responsibility for any loss or damage (including but not limiting to consequential loss, damage or destruction) arising from any use or misuse of or reliance on the content of this website or any online services on this website (including consultant and contractor registration forms and related submissions).',
        'In connection with accessing information on external third-party websites through the links provided on this website, the Catholic Diocese of Hong Kong shall not be liable for any loss, damage or destruction whatsoever arising from use of such links.',
        'Upon accessing information on this website you unconditionally accept the terms of this Disclaimer and without prior notice the Catholic Diocese of Hong Kong is entitled to making any modifications or amendments to the above terms. Please check this website regularly for any modifications or amendments.',
        'Should there be any inconsistency between the English and Chinese versions of this Disclaimer Statement, the English version prevails.',
      ],
    },
  ],
};

export const privacyPolicyContent: LegalPageContentData = {
  title: 'Privacy Policy Statement',
  description:
    'How the Catholic Diocese of Hong Kong protects personal data collected through this DBDC website.',
  sections: [
    {
      heading: 'Privacy Policy Statement',
      paragraphs: [
        'The Catholic Diocese of Hong Kong highly respects the privacy, confidentiality and security of personal information of our website visitors and is fully committed to complying with the Personal Data (Privacy) Ordinance of the Hong Kong Special Administrative Region. We are equally committed to ensuring that all our employees and agents uphold these obligations.',
      ],
    },
    {
      heading: 'Collection of Personal Data',
      paragraphs: [
        'When you submit a consultant or contractor registration form, or otherwise provide information through this website, you voluntarily agree to provide personal and confidential details such as name, company information, phone number, email address, postal address, and other particulars required for processing your enquiry or application. Without such personal data, we may not be able to process your submission or respond to your request.',
        'We do not collect personal credit card or bank account information through this website’s registration forms.',
        'If you agree to receive email or post mail from us, we also will not request personal credit card and bank account information.',
        'When you visit our website, we may collect from your device information such as the basic information of your operating system and browser, and IP addresses. This type of information would provide us with website usage statistics.',
        'We may use cookies to identify web visitors and to track the visitors’ activities. Cookies are small files which are sent from a website and placed on the browser of the visitor’s computer or mobile phone. They do not store personally identifiable information.',
      ],
    },
    {
      heading: 'Retention of Personal Data',
      paragraphs: [
        'All personal data collected will not be kept longer than necessary for the intended purposes as stated under “Collection of Personal Data” above or for the legal requirement of internal audit. We will comply with all statutory and regulatory requirements in Hong Kong for the retention of personal data collected.',
      ],
    },
    {
      heading: 'Use and Disclosure of Personal Data',
      paragraphs: [
        'Personal data collected via this website (including confidential information submitted through registration forms) is solely used by the Diocesan Building and Development Commission for the purpose of fulfilling our building and development services, processing applications and enquiries, and related administrative purposes.',
        'Only with your consent or your indication of no objection, personal information may be disclosed to third parties who help organise Diocesan activities or provide necessary professional support in connection with your submission.',
        'Without your expressed consent we will not sell, rent, trade or otherwise disclose or transfer your personal data to any other third parties. However, we may be obliged to comply with the statutory obligations or required by the Judiciary of Hong Kong to disclose your personal information to any designated person or statutory department/organization.',
      ],
    },
    {
      heading: 'Protection Measures',
      paragraphs: [
        'We take all practicable steps to protect all personal data and hold against unauthorized or accidental access, processing, erasure, loss or use.',
        'All personal data collected will be encrypted where appropriate, securely stored and kept strictly confidential.',
        'We will keep up with technological advancement in ensuring the security of personal data collected and stored.',
      ],
    },
    {
      heading: 'Access, Correction and Removal',
      paragraphs: [
        `At any time you have the right to request access to your personal information kept by us or that personal information be corrected or removed where appropriate by contacting us through email to ${CONTACT_EMAIL}.`,
      ],
    },
    {
      heading: 'Amendment to this Statement',
      paragraphs: [
        'We may make amendment or update to this Statement without prior notice, please check this website regularly for any amendment or update. If there is any inconsistency between the English and Chinese versions of this Statement, the English version shall prevail.',
      ],
    },
  ],
};

export const picsPageContent: LegalPageContentData = {
  title: 'Personal Information Collection Statement',
  description:
    'How personal and confidential information submitted through this website is collected and used.',
  sections: [
    {
      heading: 'Personal Information Collection Statement',
      paragraphs: [
        'The Catholic Diocese of Hong Kong is committed to protecting the privacy, confidentiality and security of the personal information we hold by complying with the requirements of Personal Data (Privacy) Ordinance of the Hong Kong Special Administrative Region with respect to the collection and management of personal information. We are equally committed to ensuring that all our employees and agents uphold these obligations.',
      ],
    },
    {
      heading: 'Purpose of Collecting Personal Information',
      paragraphs: [
        'In the provision of services through this Diocesan Building and Development Commission website, including consultant and contractor registration, we may collect personal and confidential information to process your application or enquiry.',
        'To process such submissions, we may collect from you the following data:',
        'Name of applicant / company contact person; phone number; email address; postal address; company particulars; professional qualifications and related supporting information required by the relevant form.',
        'We do not collect credit card or bank account information through the registration forms on this website.',
        'If we communicate with you via post mail or email, we also will not request personal credit card and bank account information.',
        'Your supply of the above personal information is on a voluntary basis. If you do not prefer to do so, we may not be able to fulfill the above-mentioned purposes.',
        'When you visit our website, we may collect from your device information such as the basic information of your operating system and browser, and IP addresses. This type of information would only provide us with website usage statistics.',
      ],
    },
    {
      heading: 'Use of Cookies',
      paragraphs: [
        'We use cookies to identify web visitors and to track the visitors’ activities in order to help customize user experience on our website (e.g. to remember your browsing preferences with language or font size). Cookies are small files which are sent from a website and placed on the browser of the visitor’s computer or mobile phone. They do not store personally identifiable information.',
        'You may choose to disable your website browser to accept cookies, but this may affect your use of some functions and features of our website.',
      ],
    },
    {
      heading: 'Transfer and Management of Personal Information',
      paragraphs: [
        'We shall store your personal information for our internal verification, assessment and audit purposes in connection with DBDC services.',
        'With your consent or indication of no objection, we shall use your name, email, telephone number or address for the Diocese’s or the Commission’s future communications with you.',
        'The Diocese and the Commission will not sell, rent, trade or otherwise transfer your data in any form to any third parties, except where necessary to process your submission with your consent, or as required by law.',
        'We may be obligated to comply with any statutory obligations or instructions from the judiciary of Hong Kong to disclose personal information to designated person or organization.',
      ],
    },
    {
      heading: 'Security Measures',
      paragraphs: [
        'We take all practicable steps to protect all personal data and hold against unauthorised or accidental access, processing, erasure, loss or use.',
        'All personal data collected will be encrypted where appropriate, securely stored and kept strictly confidential.',
        'The Diocese and the Commission will also have appropriate security measures in handling and storing your personal data.',
      ],
    },
    {
      heading: 'Access, Correction and Removal of Personal Information',
      paragraphs: [
        `At any time you have the right to request access to your personal information kept by us or that personal information be corrected or removed where appropriate by contacting us through email (${CONTACT_EMAIL}).`,
      ],
    },
    {
      heading: 'Amendment to this Statement',
      paragraphs: [
        'We may make amendment or update to this Statement without prior notice. Please check this website regularly for any amendment or update. If there is any inconsistency between the English and Chinese versions of this Statement, the English version shall prevail.',
      ],
    },
  ],
};
