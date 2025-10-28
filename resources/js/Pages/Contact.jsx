import React from 'react'
import PublicLayout from '../Layouts/PublicLayout'

export default function Contact() {
    return (
        <PublicLayout>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                Contact Us
            </h2>
            <p style={{ fontSize: '.95rem', color: '#374151', lineHeight: '1.6rem', maxWidth: '600px', marginBottom: '1rem' }}>
                Have a suggestion or issue? We’d love to hear from you.
            </p>
            <ul style={{ color: '#2563eb', lineHeight: '1.8rem' }}>
                <li>Email: support@roznamcha.pk</li>
                <li>WhatsApp: +92 300 1234567</li>
                <li>Twitter: @roznamcha_pk</li>
            </ul>
        </PublicLayout>
    )
}
