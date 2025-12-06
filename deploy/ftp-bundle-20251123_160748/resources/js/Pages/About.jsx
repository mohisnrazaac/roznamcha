import React from 'react'
import PublicLayout from '../Layouts/PublicLayout'

export default function About() {
    return (
        <PublicLayout>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                About Roznamcha
            </h2>
            <p style={{ fontSize: '.95rem', color: '#374151', lineHeight: '1.6rem', maxWidth: '600px' }}>
                Roznamcha is designed for Pakistani households to bring simplicity and clarity
                to everyday life. It merges Kharcha Map, Ration Brain, and Reminder tools
                into a single, bilingual (Urdu/English) app experience.
            </p>
        </PublicLayout>
    )
}
