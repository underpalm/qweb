'use client';

import { useState } from 'react';

type ModalType = 'privacy' | 'imprint' | null;

export default function Footer() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-copy">© 2025 Qradient. All rights reserved.</span>
          </div>
          <div className="footer-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
            <button className="footer-link footer-link-btn" onClick={() => setModal('privacy')}>Privacy Policy</button>
            <button className="footer-link footer-link-btn" onClick={() => setModal('imprint')}>Imprint</button>
          </div>
        </div>
      </footer>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>

            {modal === 'privacy' && (
              <>
                <h2 className="modal-title">Privacy Policy</h2>

                <p className="modal-section-label">1. Controller</p>
                <p className="modal-text">
                  The controller responsible for data processing on this website is:<br />
                  <strong>[Company Name]</strong><br />
                  [Street Address]<br />
                  [ZIP Code] [City], [Country]<br />
                  Email: <strong>[contact@example.com]</strong><br />
                  Phone: <strong>[+00 000 000 000]</strong>
                </p>

                <p className="modal-section-label">2. What Data We Collect</p>
                <p className="modal-text">
                  When you visit this website, our servers automatically record the following data: IP address, browser type and version, operating system, referring URL, date and time of access, and pages visited. This data is collected for technical operation and security purposes only and is not linked to any individual person.
                </p>
                <p className="modal-text">
                  If you contact us via email or a contact form, we store your name, email address, and the content of your message in order to process your request and respond to you.
                </p>

                <p className="modal-section-label">3. Legal Basis</p>
                <p className="modal-text">
                  We process your personal data on the following legal bases under the General Data Protection Regulation (GDPR):
                </p>
                <p className="modal-text">
                  • Art. 6(1)(b) GDPR — processing necessary for the performance of a contract or pre-contractual steps.<br />
                  • Art. 6(1)(c) GDPR — processing necessary for compliance with a legal obligation.<br />
                  • Art. 6(1)(f) GDPR — processing necessary for our legitimate interests, provided these are not overridden by your interests or fundamental rights.<br />
                  • Art. 6(1)(a) GDPR — where you have given your explicit consent.
                </p>

                <p className="modal-section-label">4. Data Retention</p>
                <p className="modal-text">
                  We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. Server log files are deleted after <strong>[X days]</strong>. Contact inquiries are deleted after <strong>[X months]</strong> unless a longer retention period is legally required.
                </p>

                <p className="modal-section-label">5. Sharing of Data</p>
                <p className="modal-text">
                  We do not sell, trade, or otherwise transfer your personal data to third parties without your consent, unless required by law or necessary to provide our services. We may share data with trusted service providers who assist us in operating our website, subject to strict confidentiality agreements.
                </p>

                <p className="modal-section-label">6. Cookies</p>
                <p className="modal-text">
                  This website uses cookies to enhance your browsing experience. Essential cookies are required for the website to function correctly. We do not use tracking or advertising cookies without your explicit consent. You may disable cookies in your browser settings at any time, though this may affect certain features of the website.
                </p>

                <p className="modal-section-label">7. Your Rights</p>
                <p className="modal-text">
                  Under the GDPR, you have the following rights regarding your personal data:
                </p>
                <p className="modal-text">
                  • <strong>Right of access</strong> — you may request a copy of the data we hold about you.<br />
                  • <strong>Right to rectification</strong> — you may request correction of inaccurate data.<br />
                  • <strong>Right to erasure</strong> — you may request deletion of your data under certain conditions.<br />
                  • <strong>Right to restriction</strong> — you may request that we limit the processing of your data.<br />
                  • <strong>Right to data portability</strong> — you may request your data in a structured, machine-readable format.<br />
                  • <strong>Right to object</strong> — you may object to processing based on legitimate interests.<br />
                  • <strong>Right to withdraw consent</strong> — where processing is based on consent, you may withdraw it at any time.
                </p>
                <p className="modal-text">
                  To exercise any of these rights, please contact us at <strong>[contact@example.com]</strong>. You also have the right to lodge a complaint with your local data protection authority.
                </p>

                <p className="modal-section-label">8. Changes to This Policy</p>
                <p className="modal-text">
                  We may update this Privacy Policy from time to time. The current version is always available on this page. Last updated: <strong>[Date]</strong>.
                </p>
              </>
            )}

            {modal === 'imprint' && (
              <>
                <h2 className="modal-title">Imprint</h2>

                <p className="modal-section-label">Service Provider</p>
                <p className="modal-text">
                  <strong>[Company Name]</strong><br />
                  [Street Address]<br />
                  [ZIP Code] [City]<br />
                  [Country]
                </p>

                <p className="modal-section-label">Contact</p>
                <p className="modal-text">
                  Email: <strong>[contact@example.com]</strong><br />
                  Phone: <strong>[+00 000 000 000]</strong><br />
                  Website: <strong>[www.example.com]</strong>
                </p>

                <p className="modal-section-label">Represented by</p>
                <p className="modal-text">
                  <strong>[Full Name]</strong>, [Title / CEO / Managing Director]
                </p>

                <p className="modal-section-label">Commercial Register</p>
                <p className="modal-text">
                  Register Court: <strong>[Local Court, City]</strong><br />
                  Registration Number: <strong>[HRB 000000]</strong>
                </p>

                <p className="modal-section-label">VAT Identification Number</p>
                <p className="modal-text">
                  Pursuant to § 27a of the German Value Added Tax Act (UStG):<br />
                  <strong>[DE000000000]</strong>
                </p>

                <p className="modal-section-label">Responsible for Content</p>
                <p className="modal-text">
                  Pursuant to § 18 para. 2 MStV:<br />
                  <strong>[Full Name]</strong><br />
                  [Street Address]<br />
                  [ZIP Code] [City]
                </p>

                <p className="modal-section-label">Dispute Resolution</p>
                <p className="modal-text">
                  The European Commission provides a platform for online dispute resolution (ODR): <strong>https://ec.europa.eu/consumers/odr</strong>. We are not obligated to participate in dispute resolution proceedings before a consumer arbitration board and do not voluntarily do so.
                </p>

                <p className="modal-section-label">Liability Notice</p>
                <p className="modal-text">
                  Despite careful review, we assume no liability for the content of external links. The operators of linked pages are solely responsible for their content. All content on this website is created with care; however, we cannot guarantee completeness, accuracy, or timeliness.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
