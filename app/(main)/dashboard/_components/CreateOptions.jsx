"use client";

import Link from 'next/link';

import { Phone, Video, ArrowRight, FileText } from 'lucide-react'; 
import { motion } from 'framer-motion';

// OptionCard component remains the same.
const OptionCard = ({ href, icon, title, description, darkMode }) => {
    return (
        <Link href={href} passHref>
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`
                    group relative rounded-2xl p-6 flex flex-col gap-4 cursor-pointer h-full border transition-all duration-300
                    ${darkMode 
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10' 
                        : 'bg-white border-slate-200 hover:shadow-xl hover:border-blue-300'
                    }
                `}
            >
                {/* Icon with styled background */}
                <div 
                    className={`
                        w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300
                        ${darkMode 
                            ? 'bg-slate-800 group-hover:bg-slate-700' 
                            : 'bg-blue-50 group-hover:bg-blue-100'
                        }
                    `}
                >
                    {icon}
                </div>
                
                {/* Text Content */}
                <div className="flex-grow">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        {title}
                    </h2>
                    <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                        {description}
                    </p>
                </div>
                
                {/* Call-to-action Arrow */}
                <div className="absolute top-6 right-6 p-2 rounded-full bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <ArrowRight className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
            </motion.div>
        </Link>
    );
};


function CreateOptions({ darkMode = true }) {
    
    // The options array now only contains two items.
    const options = [
        {
            href: '/dashboard/create-interview',
            icon: <Video className={`h-10 w-10 transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
            title: 'Create New Interview',
            description: 'Create AI Interviews and schedule them with candidates.',
        },
        {
            href: '/dashboard/aptitude',
            icon: <Phone className={`h-8 w-8 transition-colors duration-300 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />,
            title: 'Mock Aptitude Test',
            description: 'Create mock aptitude tests for candidates.',
        }
    ];

    return (
      
        // The grid layout is updated to better handle only two items.
        // We removed `lg:grid-cols-3` so it stays at 2 columns on all larger screens.
        // `max-w-5xl mx-auto` is added to give it a nice centered look on very wide screens.
        <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
            {options.map((option) => (
                <OptionCard 
                    key={option.title}
                    href={option.href}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    darkMode={darkMode}
                />
            ))}
        </div>
    );
}

export default CreateOptions;