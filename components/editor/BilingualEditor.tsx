import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { Copy } from 'lucide-react';

interface BilingualEditorProps {
    contentEn: string;
    contentNp: string;
    onChangeEn: (content: string) => void;
    onChangeNp: (content: string) => void;
    label: string;
    placeholderEn?: string;
    placeholderNp?: string;
}

const BilingualEditor: React.FC<BilingualEditorProps> = ({
    contentEn,
    contentNp,
    onChangeEn,
    onChangeNp,
    label,
    placeholderEn,
    placeholderNp,
}) => {
    const [activeTab, setActiveTab] = useState<'en' | 'np'>('en');

    const copyFromEnglish = () => {
        onChangeNp(contentEn);
    };

    const copyFromNepali = () => {
        onChangeEn(contentNp);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-3 rounded-t-xl border-x border-t border-gray-200">
                <label className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">{label}</label>
                <div className="flex p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setActiveTab('en')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${activeTab === 'en'
                                ? 'bg-ruju-red text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        ENGLISH
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('np')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${activeTab === 'np'
                                ? 'bg-ruju-red text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        नेपाली
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-x border-b border-gray-200 rounded-b-xl p-4 bg-white">
                {/* English Editor */}
                <div className={activeTab === 'en' ? 'block' : 'hidden'}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">English Input</span>
                        <button
                            type="button"
                            onClick={copyFromNepali}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors bg-blue-50 px-2 py-1 rounded"
                            title="Copy from Nepali"
                        >
                            <Copy size={12} />
                            Copy from Nepali
                        </button>
                    </div>
                    <RichTextEditor
                        content={contentEn}
                        onChange={onChangeEn}
                        placeholder={placeholderEn || 'Write in English...'}
                    />
                </div>

                {/* Nepali Editor */}
                <div className={activeTab === 'np' ? 'block' : 'hidden'}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">नेपाली इनपुट</span>
                        <button
                            type="button"
                            onClick={copyFromEnglish}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors bg-blue-50 px-2 py-1 rounded"
                            title="Copy from English"
                        >
                            <Copy size={12} />
                            अंग्रेजीबाट प्रतिलिपि
                        </button>
                    </div>
                    <RichTextEditor
                        content={contentNp}
                        onChange={onChangeNp}
                        placeholder={placeholderNp || 'नेपालीमा लेख्नुहोस्...'}
                    />
                </div>
            </div>
        </div>
    );
};

export default BilingualEditor;
