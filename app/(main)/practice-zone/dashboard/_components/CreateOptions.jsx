"use client";

import Link from 'next/link';
import { Phone, Video, ArrowRight } from 'lucide-react';

// A simple, static card component for clarity and ease of use.
const OptionCard = ({ href, icon, title, description }) => {
    return (
        <Link href={href} passHref>
            <div className="rounded-xl p-6 flex flex-col gap-4 cursor-pointer h-full border border-gray-300 bg-white hover:border-gray-400 hover:shadow-md transition-shadow duration-300">
                
                {/* Static Icon */}
                <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gray-100">
                    {icon}
                </div>
                
                {/* Text Content */}
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-black">
                        {title}
                    </h2>
                    <p className="mt-1 text-gray-600">
                        {description}
                    </p>
                </div>
                
                {/* Simple Call-to-action Link */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center font-semibold text-gray-600">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

function CreateOptions() {
    
    const options = [
        {
            href: '/dashboard/create-interview',
            icon: <Video className="h-9 w-9 text-gray-600" />,
            title: 'Create New Interview',
            description: 'Design and schedule AI-powered video interviews for candidates.',
        },
        {
            href: '/dashboard/aptitude',
            icon: <Phone className="h-8 w-8 text-gray-600" />,
            title: 'Mock Aptitude Test',
            description: 'Generate and assign mock aptitude tests to evaluate candidates.',
        }
    ];

    return (
        <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-4'>
            {options.map((option) => (
                <OptionCard 
                    key={option.title}
                    href={option.href}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                />
            ))}
        </div>
    );
}

export default CreateOptions;