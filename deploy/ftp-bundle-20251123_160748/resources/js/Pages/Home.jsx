import React from 'react'
import PublicLayout from '../Layouts/PublicLayout'

export default function Home() {
    return (
        <PublicLayout>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                Welcome to Roznamcha
            </h2>
            <p style={{ fontSize: '.95rem', color: '#374151', lineHeight: '1.6rem', maxWidth: '600px' }}>
                Roznamcha is your daily household survival cockpit. Track your expenses,
                monitor grocery inflation, manage reminders, and get month-end survival reports — all in one place.
            </p>
        </PublicLayout>
    )
}
