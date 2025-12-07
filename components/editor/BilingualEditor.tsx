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
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-700">{label}</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('en')}
                        className={`px-3 py-1 text-sm rounded ${activeTab === 'en' ? 'bg-ruju-red text-white' : 'bg-gray-200'
                            }`}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('np')}
                        className={`px-3 py-1 text-sm rounded ${activeTab === 'np' ? 'bg-ruju-red text-white' : 'bg-gray-200'
                            }`}
                    >
                        नेपाली
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* English Editor */}
                <div className={activeTab === 'en' ? '' : 'hidden lg:block'}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">English</span>
                        <button
                            type="button"
                            onClick={copyFromNepali}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                <div className={activeTab === 'np' ? '' : 'hidden lg:block'}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">नेपाली</span>
                        <button
                            type="button"
                            onClick={copyFromEnglish}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
