import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone, Shield, FileText, Users, Briefcase, Scale } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { api } from '../services/api';

interface PageProps {
  lang: Language;
}

export const About: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].about;
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-white">
      <h1 className="text-4xl font-bold text-black mb-8 text-center">{t.title}</h1>
      <div className="prose prose-lg max-w-none text-black">
        <p className="lead text-xl text-black font-medium border-l-4 border-ruju-red pl-4">{t.lead}</p>
        <h3 className="text-black font-bold">{t.mission_title}</h3>
        <p>{t.mission_desc}</p>
        <h3 className="text-black font-bold">{t.method_title}</h3>
        <ol>
          {t.method_steps.map((step, index) => (
            <li key={index}><strong className="text-black">{step.title}:</strong> {step.desc}</li>
          ))}
        </ol>
        <div className="bg-white p-6 rounded-lg mt-8 flex items-start gap-4 border border-black/10 shadow-sm">
          <Shield className="h-8 w-8 text-ruju-red flex-shrink-0" />
          <div>
            <h4 className="text-lg font-bold text-black mt-0">{t.trust_title}</h4>
            <p className="mb-0 text-sm text-black">{t.trust_desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Contact: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].contact;
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 bg-white">
      <h1 className="text-4xl font-bold text-black mb-8 text-center">{t.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-black">{t.subtitle}</h3>
          <p className="text-black mb-8">{t.desc}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-black">
              <Mail className="h-5 w-5 text-ruju-red" />
              <span className="font-medium">contact@ruju.np</span>
            </div>
            <div className="flex items-center gap-3 text-black">
              <Phone className="h-5 w-5 text-ruju-red" />
              <span className="font-medium">+977 1 4444444</span>
            </div>
            <div className="flex items-center gap-3 text-black">
              <MapPin className="h-5 w-5 text-ruju-red" />
              <span className="font-medium">{t.address}</span>
            </div>
          </div>
        </div>
        <form className="bg-white shadow-md rounded-lg p-6 border border-black/10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">{t.name}</label>
              <input type="text" className="w-full border border-black/20 rounded-md p-3 bg-white focus:border-black outline-none transition text-black placeholder:text-black/30" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">{t.email}</label>
              <input type="email" className="w-full border border-black/20 rounded-md p-3 bg-white focus:border-black outline-none transition text-black placeholder:text-black/30" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">{t.message}</label>
              <textarea rows={4} className="w-full border border-black/20 rounded-md p-3 bg-white focus:border-black outline-none transition text-black placeholder:text-black/30"></textarea>
            </div>
            <button className="w-full bg-ruju-red text-white py-2 rounded font-bold hover:bg-black transition">{t.send}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SubmitClaim: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].submit;
  const [claim, setClaim] = useState('');
  const [source, setSource] = useState('');
  const [evidence, setEvidence] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setEvidenceFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim) return;

    // Validate: must have either evidence URL or file
    if (!evidence && !evidenceFile) {
      alert('Please provide either an evidence URL or upload a file');
      return;
    }

    try {
      setSubmitting(true);

      let evidenceFilePath = '';

      // Upload file if provided
      if (evidenceFile) {
        const uploadResponse = await api.uploadFile(evidenceFile);
        evidenceFilePath = uploadResponse.url;
      }

      // Submit claim with file path or URL
      await api.submitClaim(claim, source, evidence || evidenceFilePath);

      setSubmitted(true);
      setClaim('');
      setSource('');
      setEvidence('');
      setEvidenceFile(null);

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit claim', error);
      alert('Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-black mb-4">
        {lang === Language.EN ? 'Submit a Claim' : 'दाबी पेश गर्नुहोस्'}
      </h1>
      <p className="text-gray-600 mb-8">
        {lang === Language.EN
          ? 'Help us combat misinformation by submitting claims you\'d like us to verify.'
          : 'तपाईंले प्रमाणित गर्न चाहनुभएको दाबी पेश गरेर हामीलाई गलत सूचना विरुद्ध लड्न मद्दत गर्नुहोस्।'}
      </p>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
          {lang === Language.EN
            ? 'Thank you! Your claim has been submitted and will be reviewed by our team.'
            : 'धन्यवाद! तपाईंको दाबी पेश गरिएको छ र हाम्रो टोलीले समीक्षा गर्नेछ।'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {lang === Language.EN ? 'Claim *' : 'दाबी *'}
          </label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-transparent outline-none"
            rows={4}
            placeholder={lang === Language.EN ? 'Enter the claim you want us to verify...' : 'तपाईंले प्रमाणित गर्न चाहनुभएको दाबी प्रविष्ट गर्नुहोस्...'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {lang === Language.EN ? 'Source URL (optional)' : 'स्रोत URL (वैकल्पिक)'}
          </label>
          <input
            type="url"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-transparent outline-none"
            placeholder={lang === Language.EN ? 'https://...' : 'https://...'}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {lang === Language.EN ? 'Evidence (URL or File) *' : 'प्रमाण (URL वा फाइल) *'}
          </label>
          <input
            type="url"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-transparent outline-none mb-4"
            placeholder={lang === Language.EN ? 'Evidence URL (optional if uploading file)' : 'प्रमाण URL (फाइल अपलोड गर्दा वैकल्पिक)'}
          />

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-ruju-red bg-red-50' : 'border-gray-300'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="evidence-file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,.pdf"
            />
            <label htmlFor="evidence-file" className="cursor-pointer">
              {evidenceFile ? (
                <div>
                  <p className="text-green-600 font-bold">{evidenceFile.name}</p>
                  <p className="text-sm text-gray-500">{(evidenceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">
                    {lang === Language.EN
                      ? 'Drag and drop a file here, or click to select'
                      : 'यहाँ फाइल ड्र्याग र ड्रप गर्नुहोस्, वा चयन गर्न क्लिक गर्नुहोस्'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {lang === Language.EN
                      ? 'Supported: Images, Videos, PDF (Max 10MB)'
                      : 'समर्थित: छविहरू, भिडियोहरू, PDF (अधिकतम 10MB)'}
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ruju-red text-white font-bold py-3 px-6 rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {submitting
            ? (lang === Language.EN ? 'Submitting...' : 'पेश गर्दै...')
            : (lang === Language.EN ? 'Submit Claim' : 'दाबी पेश गर्नुहोस्')}
        </button>
      </form>
    </div>
  );
};

export const Methodology: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].methodology;
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-ruju-red/10 rounded-full mb-4">
          <FileText className="h-8 w-8 text-ruju-red" />
        </div>
        <h1 className="text-4xl font-bold text-black mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600">{t.intro}</p>
      </div>
      <div className="space-y-8">
        {t.steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-black/10 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-black mb-2">{step.title}</h3>
            <p className="text-gray-700">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Team: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].team;
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-ruju-red/10 rounded-full mb-4">
          <Users className="h-8 w-8 text-ruju-red" />
        </div>
        <h1 className="text-4xl font-bold text-black mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.intro}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.members.map((member, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-black/10 shadow-sm text-center hover:shadow-md transition">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-black">{member.name}</h3>
            <p className="text-ruju-red font-medium text-sm mb-3">{member.role}</p>
            <p className="text-gray-600 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Careers: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].careers;
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-ruju-red/10 rounded-full mb-4">
          <Briefcase className="h-8 w-8 text-ruju-red" />
        </div>
        <h1 className="text-4xl font-bold text-black mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600">{t.intro}</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-black/10 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-black mb-4">{t.openings_title}</h2>
        <p className="text-gray-700 italic">{t.no_openings}</p>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-black mb-4">{t.internship_title}</h2>
        <p className="text-gray-700 mb-6">{t.internship_desc}</p>
        <button className="bg-ruju-red text-white px-6 py-2 rounded-full font-bold hover:bg-black transition">
          {t.apply_btn}
        </button>
      </div>
    </div>
  );
};

export const Terms: React.FC<PageProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].terms;
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-ruju-red/10 rounded-full mb-4">
          <Scale className="h-8 w-8 text-ruju-red" />
        </div>
        <h1 className="text-4xl font-bold text-black mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600">{t.intro}</p>
      </div>

      <div className="space-y-8">
        {t.sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-xl font-bold text-black mb-2">{section.title}</h3>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};