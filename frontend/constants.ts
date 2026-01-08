import { FactCheckArticle, VerdictType, Language } from './types';

// ... translations kept ...

export const TRANSLATIONS = {
  EN: {
    nav: {
      home: 'Home',
      ruju_ai: 'RujuAI',
      verify: 'Verify Claim',
      media: 'Media Check',
      feed: 'Latest Facts',
      about: 'About',
      submit: 'Submit Claim',
      donate: 'Donate',
      switchLang: 'Switch Language'
    },
    hero: {
      title: 'Fighting Misinformation,',
      subtitle: 'Protecting the Truth.',
      desc: 'Nepal’s premier AI-powered fact-checking platform using real-time data verification.',
      btn_verify: 'Start Verifying',
      btn_learn: 'Learn More',
      search_placeholder: 'Paste a claim, headline, or rumor here...',
      trust_ai: 'Verified by AI',
      trust_human: 'Human Review',
      trust_reg: 'Press Council Reg'
    },
    home: {
      media_title: 'Verify Images & Videos',
      media_desc: 'Suspicious photo? Deepfake video? Upload media files to run a forensic analysis using our advanced multimodal AI models.',
      media_btn: 'Check Media File',
      latest_title: 'Latest Fact Checks',
      latest_desc: 'Recent verifications from our editorial team.',
      view_all: 'View All',
      how_title: 'How We Fight Misinformation',
      step1_title: '1. Detection',
      step1_desc: 'We monitor social media trends and accept user submissions to identify viral claims.',
      step2_title: '2. AI Verification',
      step2_desc: 'Our Gemini-powered engine cross-references claims with trusted global data sources instantly.',
      step3_title: '3. Expert Review',
      step3_desc: 'Complex cases are reviewed by certified journalists before final publication.'
    },
    verify: {
      title: 'Verify a Claim',
      subtitle: 'Enter a statement, headline, or rumor to check its accuracy.',
      placeholder: 'e.g., Did the government announce a public holiday tomorrow?',
      btn_analyze: 'Verify',
      btn_analyzing: 'Analyzing...',
      result_title: 'AI Analysis Result',
      claim_analysis: 'Claim Analysis',
      confidence: 'AI Confidence Score',
      reasoning: 'Detailed Reasoning',
      evidence: 'Evidence & Sources',
      disagree: 'Disagree with this verdict? Submit for manual review.',
      error: 'Could not verify claim. Please try again later.'
    },
    media: {
      title: 'Media Verification Tool',
      subtitle: 'Detect manipulation, AI generation, and verify context.',
      upload_title: 'Upload Image',
      drag_drop: 'Drag & drop or click to upload',
      supports: 'Supports JPG, PNG (Max 5MB)',
      context_label: 'Additional Context (Optional)',
      context_placeholder: 'Where did you find this? What is the claim?',
      btn_run: 'Run Forensic Analysis',
      btn_running: 'Analyzing Image...',
      report_title: 'Analysis Report',
      summary: 'Summary',
      findings: 'Detailed Findings',
      note: 'Note: AI detection tools are probabilistic. Verify with official sources.',
      ready_title: 'Ready to Analyze',
      ready_desc: 'Upload an image to check for deepfakes, manipulation, or source context.'
    },
    feed: {
      title: 'Fact-Check Archive',
      filter_all: 'All',
      filter_politics: 'Politics',
      filter_tech: 'Technology',
      filter_economy: 'Economy',
      filter_society: 'Society',
      checked_by: 'Fact checked by'
    },
    article: {
      back: 'Back to Feed',
      verdict: 'Verdict',
      claim_title: 'The Claim',
      facts_title: 'The Facts',
      conclusion_title: 'Conclusion',
      share_title: 'Share this fact-check',
      share_btn: 'Share',
      conclusion_text: 'Based on the evidence gathered, the claim is',
      conclusion_advisory: 'We advise users not to share this content without official verification.',
      investigation: 'During our investigation, we cross-referenced the claims made in the statement with official records and primary data sources. The evidence suggests that the original information was',
      status_accurate: 'accurate.',
      status_inaccurate: 'inaccurate or contextualized incorrectly.',
      consultation: 'We also consulted with subject matter experts who confirmed that the nuances presented in the viral claim lacked necessary context.'
    },
    about: {
      title: 'About RUJU',
      lead: 'RUJU (meaning "Verification" in Nepali) is an independent initiative dedicated to combating misinformation in the digital age.',
      mission_title: 'Our Mission',
      mission_desc: 'To promote truth and digital literacy by providing accessible, transparent, and accurate fact-checking services powered by ethical AI and human expertise.',
      method_title: 'Methodology',
      method_steps: [
        { title: 'Selection', desc: 'We identify potential misinformation based on virality and public interest.' },
        { title: 'Investigation', desc: 'Our AI tools scan global databases, while human researchers verify primary sources.' },
        { title: 'Verdict', desc: 'We assign a clear rating (True, False, Misleading, Unverified) based on evidence.' },
        { title: 'Publication', desc: 'Findings are published transparently with all references cited.' }
      ],
      trust_title: 'Trust Indicators',
      trust_desc: 'RUJU adheres to the code of principles of the International Fact-Checking Network (IFCN) and is registered with the Press Council of Nepal.'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in Touch',
      desc: 'Have a question about our process or want to report a technical issue?',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      address: 'Kathmandu, Nepal'
    },
    submit: {
      title: 'Submit a Claim',
      subtitle: 'Spotted something suspicious? Send it to our team for review.',
      label_claim: 'The Claim *',
      placeholder_claim: 'What statement would you like us to check?',
      label_source: 'Source Link (Optional)',
      label_evidence: 'Upload Evidence (Screenshot/Video)',
      btn_submit: 'Submit for Review',
      disclaimer: 'By submitting, you agree to our Terms of Service. We do not collect personal data without consent.'
    },
    donate: {
      title: 'Support Independent Fact-Checking',
      subtitle: 'Help us fight misinformation and keep the truth accessible to everyone.',
      desc: 'RUJU is a non-profit initiative. Your contribution helps us maintain our AI infrastructure, support our research team, and expand our media literacy programs.',
      methods_title: 'Ways to Donate',
      bank_transfer: 'Bank Transfer',
      esewa: 'eSewa / Khalti',
      card: 'Credit/Debit Card',
      account_name: 'Account Name',
      account_num: 'Account Number',
      bank_name: 'Bank Name',
      branch: 'Branch',
      esewa_id: 'eSewa ID',
      scan_qr: 'Scan QR Code',
      copy: 'Copy',
      thank_you: 'Thank you for your support!'
    },
    footer: {
      tagline: 'Verifying truth in the digital age.',
      registered: 'Registered with Press Council Nepal.',
      platform: 'Platform',
      resources: 'Resources',
      newsletter: 'Newsletter',
      newsletter_desc: 'Get the latest fact-checks delivered to your inbox.',
      email_placeholder: 'Email address',
      rights: 'RUJU FactCheck. All rights reserved.',
      privacy: 'Privacy Policy',
      contact: 'Contact',
      media_literacy: 'Media Literacy',
      methodology: 'Methodology',
      team: 'Our Team',
      careers: 'Careers & Internship',
      terms: 'Terms & Conditions'
    },
    methodology: {
      title: 'Our Methodology',
      intro: 'At RUJU FactCheck, we follow a rigorous, transparent process to ensure every claim we verify is backed by evidence.',
      steps: [
        { title: '1. Select the Claim', desc: 'We monitor social media, news outlets, and user submissions to identify claims that are viral, harmful, or of significant public interest.' },
        { title: '2. Research & Evidence Gathering', desc: 'Our team consults primary sources, official documents, and subject matter experts. We use AI tools to assist in data scanning but rely on human verification for final judgment.' },
        { title: '3. Verdict Determination', desc: 'Based on the evidence, we assign a rating: True, False, Misleading, or Unverified.' },
        { title: '4. Review & Edit', desc: 'Every fact-check undergoes a multi-stage review process by senior editors to ensure neutrality and accuracy.' },
        { title: '5. Publish & Correct', desc: 'We publish our findings clearly. If we make a mistake, we correct it openly and transparently.' }
      ]
    },
    team: {
      title: 'Our Team',
      intro: 'Meet the journalists, researchers, and developers behind RUJU FactCheck.',
      members: [
        { name: 'Aarav Sharma', role: 'Editor-in-Chief', bio: 'Senior journalist with 15+ years of experience in investigative reporting.' },
        { name: 'Priya Karki', role: 'Lead Researcher', bio: 'Data analyst and fact-checking specialist focusing on digital misinformation.' },
        { name: 'Rohan Thapa', role: 'AI Engineer', bio: 'Developing the AI models that power our real-time verification engine.' }
      ]
    },
    careers: {
      title: 'Careers & Internship',
      intro: 'Join us in the fight against misinformation.',
      openings_title: 'Current Openings',
      no_openings: 'There are currently no full-time openings. However, we are always looking for interns.',
      internship_title: 'Internship Program',
      internship_desc: 'We offer a 3-month paid internship for students in Journalism, Mass Communication, or Computer Science.',
      apply_btn: 'Apply Now'
    },
    terms: {
      title: 'Terms and Conditions',
      intro: 'Please read these terms carefully before using our platform.',
      sections: [
        { title: '1. Acceptance of Terms', content: 'By accessing RUJU FactCheck, you agree to be bound by these terms.' },
        { title: '2. Use of Content', content: 'Our content is for informational purposes only. You may share our fact-checks with proper attribution.' },
        { title: '3. Disclaimer', content: 'While we strive for accuracy, we cannot guarantee that all information is 100% error-free. We are not liable for any damages arising from the use of our content.' },
        { title: '4. Privacy', content: 'We respect your privacy. We do not sell your personal data to third parties.' }
      ]
    },
    verdict: {
      true: 'True',
      false: 'False',
      misleading: 'Misleading',
      unverified: 'Unverified'
    }
  },
  NP: {
    nav: {
      home: 'गृहपृष्ठ',
      ruju_ai: 'रुजु एआई',
      verify: 'दाबी परीक्षण',
      media: 'मिडिया जाँच',
      feed: 'ताजा तथ्य',
      about: 'हाम्रो बारे',
      submit: 'दाबी पेश',
      donate: 'सहयोग',
      switchLang: 'भाषा परिवर्तन गर्नुहोस्'
    },
    hero: {
      title: 'गलत सूचना विरुद्ध,',
      subtitle: 'सत्यको रक्षा।',
      desc: 'नेपालको अग्रणी एआई-संचालित तथ्य-जाँच प्लेटफर्म, जहाँ सत्यतथ्य तुरुन्तै प्रमाणीकरण गरिन्छ।',
      btn_verify: 'जाँच सुरु गर्नुहोस्',
      btn_learn: 'थप बुझ्नुहोस्',
      search_placeholder: 'यहाँ दाबी, शीर्षक वा हल्ला टाँस्नुहोस्...',
      trust_ai: 'एआई द्वारा प्रमाणित',
      trust_human: 'विज्ञ समीक्षा',
      trust_reg: 'प्रेस काउन्सिल दर्ता'
    },
    home: {
      media_title: 'तस्बिर र भिडियो जाँच',
      media_desc: 'शंकास्पद फोटो? डीपफेक भिडियो? हाम्रो आधुनिक एआई प्रयोग गरी मिडिया फाइलहरूको विश्लेषण गर्नुहोस्।',
      media_btn: 'मिडिया फाइल जाँच गर्नुहोस्',
      latest_title: 'नवीनतम तथ्य जाँच',
      latest_desc: 'हाम्रो सम्पादकीय टोलीबाट हालैका प्रमाणीकरणहरू।',
      view_all: 'सबै हेर्नुहोस्',
      how_title: 'हामी गलत सूचना विरुद्ध कसरी लड्छौं',
      step1_title: '१. पहिचान',
      step1_desc: 'हामी सामाजिक सञ्जालका ट्रेन्डहरू निगरानी गर्छौं र भाइरल दाबीहरू पहिचान गर्छौं।',
      step2_title: '२. एआई प्रमाणीकरण',
      step2_desc: 'हाम्रो जेमिनी-संचालित इन्जिनले दाबीहरूलाई विश्वसनीय विश्वव्यापी डाटा स्रोतहरूसँग तुरुन्तै दाँज्छ।',
      step3_title: '३. विज्ञ समीक्षा',
      step3_desc: 'जटिल केसहरू अन्तिम प्रकाशन अघि प्रमाणित पत्रकारहरूद्वारा समीक्षा गरिन्छ।'
    },
    verify: {
      title: 'दाबी प्रमाणीकरण',
      subtitle: 'सत्यतथ्य जाँच गर्न कुनै भनाइ, शीर्षक वा हल्ला लेख्नुहोस्।',
      placeholder: 'उदा. के सरकारले भोलि सार्वजनिक विदा दिएको छ?',
      btn_analyze: 'प्रमाणित गर्नुहोस्',
      btn_analyzing: 'विश्लेषण गर्दै...',
      result_title: 'एआई विश्लेषण नतिजा',
      claim_analysis: 'दाबी विश्लेषण',
      confidence: 'एआई विश्वासको स्तर',
      reasoning: 'विस्तृत तर्क',
      evidence: 'प्रमाण र स्रोतहरू',
      disagree: 'यस नतिजामा सहमत हुनुहुन्न? म्यानुअल समीक्षाको लागि पेश गर्नुहोस्।',
      error: 'दाबी प्रमाणित गर्न सकिएन। कृपया केही समय पछि पुनः प्रयास गर्नुहोस्।'
    },
    media: {
      title: 'मिडिया प्रमाणीकरण उपकरण',
      subtitle: 'तस्बिर सम्पादन, एआई उत्पादन र सन्दर्भ जाँच गर्नुहोस्।',
      upload_title: 'तस्बिर अपलोड गर्नुहोस्',
      drag_drop: 'अपलोड गर्न तान्नुहोस् वा क्लिक गर्नुहोस्',
      supports: 'JPG, PNG (अधिकतम ५ एमबी) समर्थित',
      context_label: 'थप सन्दर्भ (वैकल्पिक)',
      context_placeholder: 'तपाईंले यो कहाँ फेला पार्नुभयो? दाबी के हो?',
      btn_run: 'फरेन्सिक विश्लेषण सुरु गर्नुहोस्',
      btn_running: 'तस्बिर विश्लेषण गर्दै...',
      report_title: 'विश्लेषण प्रतिवेदन',
      summary: 'सारांश',
      findings: 'विस्तृत निष्कर्षहरू',
      note: 'नोट: एआई पत्ता लगाउने उपकरणहरू सम्भाव्यतामा आधारित हुन्छन्। आधिकारिक स्रोतहरूसँग प्रमाणित गर्नुहोस्।',
      ready_title: 'विश्लेषणको लागि तयार',
      ready_desc: 'डीपफेक, सम्पादन वा स्रोत सन्दर्भ जाँच गर्न तस्बिर अपलोड गर्नुहोस्।'
    },
    feed: {
      title: 'तथ्य-जाँच अभिलेख',
      filter_all: 'सबै',
      filter_politics: 'राजनीति',
      filter_tech: 'प्रविधि',
      filter_economy: 'अर्थतन्त्र',
      filter_society: 'समाज',
      checked_by: 'तथ्य जाँचकर्ता'
    },
    article: {
      back: 'फिर्ता जानुहोस्',
      verdict: 'निर्णय',
      claim_title: 'दाबी',
      facts_title: 'तथ्यहरू',
      conclusion_title: 'निष्कर्ष',
      share_title: 'यो तथ्य-जाँच सेयर गर्नुहोस्',
      share_btn: 'सेयर',
      conclusion_text: 'संकलित प्रमाणका आधारमा, यो दाबी',
      conclusion_advisory: 'हामी प्रयोगकर्ताहरूलाई आधिकारिक प्रमाणीकरण बिना यो सामग्री सेयर नगर्न सुझाव दिन्छौं।',
      investigation: 'हाम्रो अनुसन्धानका क्रममा, हामीले आधिकारिक अभिलेख र प्राथमिक तथ्याङ्क स्रोतहरूसँग दाबीहरू क्रस-रेफरेन्स गर्यौं। प्रमाणहरूले सुझाव दिन्छ कि मूल जानकारी',
      status_accurate: 'सटीक थियो।',
      status_inaccurate: 'गलत वा गलत सन्दर्भमा प्रस्तुत गरिएको थियो।',
      consultation: 'हामीले विषय विज्ञहरूसँग पनि परामर्श गर्यौं जसले भाइरल दाबीमा प्रस्तुत गरिएका सूक्ष्मताहरूमा आवश्यक सन्दर्भको अभाव रहेको पुष्टि गरे।'
    },
    about: {
      title: 'रुजुको बारेमा',
      lead: 'रुजु (डिजिटल युगमा "प्रमाणीकरण") गलत सूचना विरुद्ध लड्ने एक स्वतन्त्र पहल हो।',
      mission_title: 'हाम्रो लक्ष्य',
      mission_desc: 'नैतिक एआई र मानवीय विशेषज्ञताद्वारा संचालित सुलभ, पारदर्शी र सटिक तथ्य-जाँच सेवाहरू प्रदान गर्दै सत्य र डिजिटल साक्षरता प्रवर्द्धन गर्नु।',
      method_title: 'कार्यविधि',
      method_steps: [
        { title: 'छनोट', desc: 'हामी भाइरलता र जनचासोको आधारमा सम्भावित गलत सूचना पहिचान गर्छौं।' },
        { title: 'अनुसन्धान', desc: 'हाम्रा एआई उपकरणहरूले विश्वव्यापी डाटाबेसहरू स्क्यान गर्छन्, जबकि मानव अनुसन्धानकर्ताहरूले प्राथमिक स्रोतहरू प्रमाणित गर्छन्।' },
        { title: 'निर्णय', desc: 'हामी प्रमाणको आधारमा स्पष्ट रेटिङ (सत्य, गलत, भ्रामक, अपुष्ट) प्रदान गर्छौं।' },
        { title: 'प्रकाशन', desc: 'सबै सन्दर्भहरू उद्धृत गर्दै निष्कर्षहरू पारदर्शी रूपमा प्रकाशित गरिन्छन्।' }
      ],
      trust_title: 'विश्वासका आधारहरू',
      trust_desc: 'रुजुले इन्टरनेसनल फ्याक्ट-चेकिङ नेटवर्क (IFCN) को सिद्धान्तहरूको पालना गर्दछ र प्रेस काउन्सिल नेपालमा दर्ता भएको छ।'
    },
    contact: {
      title: 'हामीलाई सम्पर्क गर्नुहोस्',
      subtitle: 'सम्पर्कमा रहनुहोस्',
      desc: 'हाम्रो प्रक्रियाबारे प्रश्न छ वा प्राविधिक समस्या रिपोर्ट गर्न चाहनुहुन्छ?',
      name: 'नाम',
      email: 'इमेल',
      message: 'सन्देश',
      send: 'सन्देश पठाउनुहोस्',
      address: 'काठमाडौं, नेपाल'
    },
    submit: {
      title: 'दाबी पेश गर्नुहोस्',
      subtitle: 'केहि शंकास्पद देख्नुभयो? समीक्षाको लागि हाम्रो टोलीलाई पठाउनुहोस्।',
      label_claim: 'दाबी *',
      placeholder_claim: 'तपाईं कुन भनाइ जाँच गर्न चाहनुहुन्छ?',
      label_source: 'स्रोत लिङ्क (वैकल्पिक)',
      label_evidence: 'प्रमाण अपलोड गर्नुहोस् (स्क्रिनसट/भिडियो)',
      btn_submit: 'समीक्षाको लागि पेश गर्नुहोस्',
      disclaimer: 'पेश गरेर, तपाईं हाम्रो सेवाका सर्तहरूमा सहमत हुनुहुन्छ। हामी सहमति बिना व्यक्तिगत विवरण संकलन गर्दैनौं।'
    },
    donate: {
      title: 'स्वतन्त्र तथ्य-जाँचलाई सहयोग गर्नुहोस्',
      subtitle: 'गलत सूचना विरुद्ध लड्न र सत्यलाई सबैको पहुँचमा पुर्याउन हामीलाई मद्दत गर्नुहोस्।',
      desc: 'रुजु एक गैर-नाफामूलक पहल हो। तपाईंको योगदानले हामीलाई हाम्रो एआई पूर्वाधार कायम राख्न, हाम्रो अनुसन्धान टोलीलाई सहयोग गर्न र हाम्रो मिडिया साक्षरता कार्यक्रमहरू विस्तार गर्न मद्दत गर्दछ।',
      methods_title: 'सहयोग गर्ने तरिकाहरू',
      bank_transfer: 'बैंक ट्रान्सफर',
      esewa: 'ई-सेवा / खल्ती',
      card: 'क्रेडिट/डेबिट कार्ड',
      account_name: 'खाताको नाम',
      account_num: 'खाता नम्बर',
      bank_name: 'बैंकको नाम',
      branch: 'शाखा',
      esewa_id: 'ई-सेवा आईडी',
      scan_qr: 'QR कोड स्क्यान गर्नुहोस्',
      copy: 'कपी गर्नुहोस्',
      thank_you: 'तपाईंको सहयोगको लागि धन्यवाद!'
    },
    footer: {
      tagline: 'डिजिटल युगमा सत्यको प्रमाणीकरण।',
      registered: 'प्रेस काउन्सिल नेपालमा दर्ता।',
      platform: 'प्लेटफर्म',
      resources: 'स्रोतहरू',
      newsletter: 'न्यूजलेटर',
      newsletter_desc: 'तपाईंको इनबक्समा नवीनतम तथ्य-जाँचहरू प्राप्त गर्नुहोस्।',
      email_placeholder: 'इमेल ठेगाना',
      rights: 'RUJU FactCheck. सर्वाधिकार सुरक्षित।',
      privacy: 'गोपनीयता नीति',
      contact: 'सम्पर्क',
      media_literacy: 'मिडिया साक्षरता',
      methodology: 'कार्यविधि',
      team: 'हाम्रो टोली',
      careers: 'करियर र इन्टर्नशिप',
      terms: 'नियम र सर्तहरू'
    },
    methodology: {
      title: 'हाम्रो कार्यविधि',
      intro: 'RUJU FactCheck मा, हामी प्रत्येक दाबीलाई प्रमाणसहित पुष्टि गर्न एक कठोर र पारदर्शी प्रक्रिया अपनाउँछौं।',
      steps: [
        { title: '१. दाबी छनोट', desc: 'हामी भाइरल, हानिकारक वा महत्त्वपूर्ण जनचासोका दाबीहरू पहिचान गर्न सामाजिक सञ्जाल र समाचार माध्यमहरू निगरानी गर्छौं।' },
        { title: '२. अनुसन्धान र प्रमाण संकलन', desc: 'हाम्रो टोलीले प्राथमिक स्रोतहरू, आधिकारिक कागजातहरू र विषय विज्ञहरूसँग परामर्श गर्दछ। हामी डाटा स्क्यानिङमा एआई प्रयोग गर्छौं तर अन्तिम निर्णयको लागि मानवीय प्रमाणीकरणमा भर पर्छौं।' },
        { title: '३. निर्णय निर्धारण', desc: 'प्रमाणको आधारमा, हामी रेटिङ दिन्छौं: सत्य, गलत, भ्रामक, वा अपुष्ट।' },
        { title: '४. समीक्षा र सम्पादन', desc: 'प्रत्येक तथ्य-जाँच वरिष्ठ सम्पादकहरूद्वारा बहु-चरण समीक्षा प्रक्रियाबाट गुज्रिन्छ।' },
        { title: '५. प्रकाशन र सुधार', desc: 'हामी हाम्रा निष्कर्षहरू स्पष्ट रूपमा प्रकाशित गर्छौं। यदि हामीले गल्ती गर्यौं भने, हामी यसलाई खुला र पारदर्शी रूपमा सच्याउँछौं।' }
      ]
    },
    team: {
      title: 'हाम्रो टोली',
      intro: 'RUJU FactCheck पछाडिका पत्रकार, अनुसन्धानकर्ता र विकासकर्ताहरूलाई भेट्नुहोस्।',
      members: [
        { name: 'आरभ शर्मा', role: 'प्रधान सम्पादक', bio: 'खोजी पत्रकारितामा १५+ वर्षको अनुभव भएका वरिष्ठ पत्रकार।' },
        { name: 'प्रिया कार्की', role: 'प्रमुख अनुसन्धानकर्ता', bio: 'डिजिटल गलत सूचनामा केन्द्रित डाटा विश्लेषक र तथ्य-जाँच विशेषज्ञ।' },
        { name: 'रोहन थापा', role: 'एआई इन्जिनियर', bio: 'हाम्रो रियल-टाइम प्रमाणीकरण इन्जिनलाई शक्ति दिने एआई मोडेलहरू विकास गर्दै।' }
      ]
    },
    careers: {
      title: 'करियर र इन्टर्नशिप',
      intro: 'गलत सूचना विरुद्धको लडाईमा हामीसँग सामेल हुनुहोस्।',
      openings_title: 'हालका अवसरहरू',
      no_openings: 'हाल कुनै पूर्णकालीन अवसरहरू छैनन्। यद्यपि, हामी सधैं इन्टर्नहरूको खोजीमा हुन्छौं।',
      internship_title: 'इन्टर्नशिप कार्यक्रम',
      internship_desc: 'हामी पत्रकारिता, आम सञ्चार, वा कम्प्युटर विज्ञानका विद्यार्थीहरूका लागि ३ महिनाको सशुल्क इन्टर्नशिप प्रदान गर्छौं।',
      apply_btn: 'आवेदन दिनुहोस्'
    },
    terms: {
      title: 'नियम र सर्तहरू',
      intro: 'हाम्रो प्लेटफर्म प्रयोग गर्नु अघि कृपया यी सर्तहरू ध्यानपूर्वक पढ्नुहोस्।',
      sections: [
        { title: '१. सर्तहरूको स्वीकृति', content: 'RUJU FactCheck प्रयोग गरेर, तपाईं यी सर्तहरूमा सहमत हुनुहुन्छ।' },
        { title: '२. सामग्रीको प्रयोग', content: 'हाम्रो सामग्री जानकारीमूलक उद्देश्यका लागि मात्र हो। तपाईंले उचित श्रेय दिएर हाम्रा तथ्य-जाँचहरू सेयर गर्न सक्नुहुन्छ।' },
        { title: '३. अस्वीकरण', content: 'हामी सटीकताको लागि प्रयास गर्छौं, तर सबै जानकारी १००% त्रुटिरहित छ भनी ग्यारेन्टी दिन सक्दैनौं।' },
        { title: '४. गोपनीयता', content: 'हामी तपाईंको गोपनीयताको सम्मान गर्छौं। हामी तपाईंको व्यक्तिगत डाटा तेस्रो पक्षहरूलाई बेच्दैनौं।' }
      ]
    },
    verdict: {
      true: 'सत्य',
      false: 'गलत',
      misleading: 'भ्रामक',
      unverified: 'अपुष्ट'
    }
  }
};