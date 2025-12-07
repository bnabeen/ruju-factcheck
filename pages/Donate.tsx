import React, { useState } from 'react';
import { Heart, CreditCard, Smartphone, Building2, Copy, Check } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface DonateProps {
    lang: Language;
}

const Donate: React.FC<DonateProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-ruju-red/10 rounded-full mb-4">
                        <Heart className="h-8 w-8 text-ruju-red" />
                    </div>
                    <h1 className="text-4xl font-bold text-black mb-4">{t.donate.title}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t.donate.subtitle}
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                        {t.donate.desc}
                    </p>
                </div>

                {/* Donation Methods */}
                <h2 className="text-2xl font-bold text-black mb-6 text-center">{t.donate.methods_title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bank Transfer */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-3">
                            <Building2 className="h-6 w-6 text-ruju-red" />
                            <h3 className="font-bold text-lg text-black">{t.donate.bank_transfer}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">{t.donate.bank_name}</p>
                                <p className="font-medium text-black">Everest Bank Ltd.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">{t.donate.account_name}</p>
                                <p className="font-medium text-black">RUJU Foundation</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">{t.donate.account_num}</p>
                                <div className="flex items-center gap-2">
                                    <code className="bg-gray-100 px-2 py-1 rounded text-lg font-mono text-ruju-red">00100105200458</code>
                                    <button
                                        onClick={() => handleCopy('00100105200458', 'bank')}
                                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                                        title={t.donate.copy}
                                    >
                                        {copied === 'bank' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">{t.donate.branch}</p>
                                <p className="font-medium text-black">New Baneshwor, Kathmandu</p>
                            </div>
                        </div>
                    </div>

                    {/* eSewa / Digital Wallets */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-3">
                            <Smartphone className="h-6 w-6 text-green-600" />
                            <h3 className="font-bold text-lg text-black">{t.donate.esewa}</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                {/* Placeholder for QR Code */}
                                <div className="w-32 h-32 bg-white flex items-center justify-center mb-2 shadow-sm rounded-lg">
                                    <span className="text-xs text-gray-400">QR Code</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600">{t.donate.scan_qr}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">{t.donate.esewa_id}</p>
                                <div className="flex items-center gap-2">
                                    <code className="bg-gray-100 px-2 py-1 rounded text-lg font-mono text-green-700">9841000000</code>
                                    <button
                                        onClick={() => handleCopy('9841000000', 'esewa')}
                                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                                        title={t.donate.copy}
                                    >
                                        {copied === 'esewa' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thank You Note */}
                <div className="mt-12 text-center">
                    <p className="text-ruju-red font-bold text-lg">
                        {t.donate.thank_you}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Donate;
