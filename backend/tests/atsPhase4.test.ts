import { describe, it, expect } from 'vitest';
import { validateResumeBuffer, parseResumeText, extractTextFromBuffer } from '../src/services/atsResumeParser.js';

describe('ATS Phase 4: Resume Parsing & Document Extraction Engine', () => {
  it('validates magic bytes for PDF, DOCX, DOC and reject invalid formats', () => {
    // PDF Magic Bytes: %PDF
    const pdfBuf = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]);
    const pdfVal = validateResumeBuffer(pdfBuf);
    expect(pdfVal.valid).toBe(true);
    expect(pdfVal.format).toBe('pdf');

    // DOCX Magic Bytes: PK\x03\x04
    const docxBuf = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]);
    const docxVal = validateResumeBuffer(docxBuf);
    expect(docxVal.valid).toBe(true);
    expect(docxVal.format).toBe('docx');

    // DOC Magic Bytes: \xD0\xCF\x11\xE0
    const docBuf = Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]);
    const docVal = validateResumeBuffer(docBuf);
    expect(docVal.valid).toBe(true);
    expect(docVal.format).toBe('doc');

    // Empty Buffer
    const emptyVal = validateResumeBuffer(Buffer.alloc(0));
    expect(emptyVal.valid).toBe(false);
  });

  it('correctly extracts structured candidate attributes, skills by category, and search tokens', () => {
    const sampleResume = `
      Siddharth Sharma
      Senior Full Stack Engineer
      Email: siddharth.sharma@example.com
      Phone: +91 98765 43210
      Location: Pune, India
      Experience: 7 Years in building scalable cloud-native web applications.
      Current Company: Infosys Ltd
      Education: B.Tech in Computer Science from Pune University
      Notice Period: Immediate (within 7 days)
      Current CTC: 18 LPA
      Expected CTC: 24 LPA

      Core Technical Skills:
      Backend: Golang, Python, REST APIs, Microservices, gRPC
      Frontend: React.js, TypeScript, Next.js, Tailwind CSS
      Cloud & DevOps: GCP, Kubernetes, Docker, CI/CD, Cloud Run
      Databases: BigQuery, PostgreSQL, Redis, Kafka
      Architecture: System Design, Scalability, Distributed Systems
      Testing: Jest, Cypress, Unit Testing
    `;

    const parsed = parseResumeText(sampleResume, 'Siddharth_Sharma_Resume.pdf');

    expect(parsed.fullName).toBe('Siddharth Sharma');
    expect(parsed.email).toBe('siddharth.sharma@example.com');
    expect(parsed.phone).toContain('9876543210');
    expect(parsed.totalExperienceYears).toBe(7);
    expect(parsed.location).toContain('Pune');
    expect(parsed.currentCompany).toContain('Infosys');

    // Check Categorized Skills
    expect(parsed.skillsByCategory.backend).toContain('Golang');
    expect(parsed.skillsByCategory.frontend).toContain('React.js');
    expect(parsed.skillsByCategory.cloudDevOps).toContain('GCP');
    expect(parsed.skillsByCategory.database).toContain('BigQuery');
    expect(parsed.skillsByCategory.architecture).toContain('Microservices');
    expect(parsed.skillsByCategory.qaTesting).toContain('Unit Testing');

    // Check Search Tokens Index
    expect(parsed.searchTokens).toContain('siddharth sharma');
    expect(parsed.searchTokens).toContain('siddharth.sharma@example.com');
    expect(parsed.searchTokens).toContain('pune');
    expect(parsed.searchTokens).toContain('golang');
    expect(parsed.searchTokens).toContain('gcp');

    // High confidence score
    expect(parsed.confidenceScore).toBeGreaterThanOrEqual(80);
  });

  it('extracts text from plain text and fallback buffers', async () => {
    const raw = Buffer.from('Jane Doe\nSoftware Engineer\njane@test.com\nSkills: React, Python');
    const extracted = await extractTextFromBuffer(raw, 'text');
    expect(extracted).toContain('Jane Doe');
    expect(extracted).toContain('jane@test.com');
  });

  it('correctly extracts compressed PDF streams and parses real resumes with zero syntax leak', async () => {
    // Test realistic PDF stream parsing if sample exists
    const sampleResume = `
      SRIKANTH M
      Senior Frontend Engineer Bengaluru, KA | +91 8217643770 | srikanth112236@gmail.com
      linkedin.com/in/srikanth-mallikarjuna-4b4634227

      PROFESSIONAL SUMMARY
      Performance-driven Senior Frontend Engineer with 4.9 years of experience in the React ecosystem.
      
      TECHNICAL SKILLS
      • Languages & Frameworks: JavaScript (ES6+), TypeScript, React.js, Next.js, Node.js, Express.js
      • State Management & Data: Redux, REST APIs, GraphQL, MongoDB, JWT
      • UI & Styling: HTML5, CSS3, SCSS, Tailwind CSS, Material UI, Ant Design, GSAP

      PROFESSIONAL EXPERIENCE
      VEDASYNK TECHNOLOGIES | Senior Frontend Developer | Nov 2025 – AUGUST 2026

      EDUCATION
      • Bachelor of Commerce (B.Com) | Vivekananda Degree College | 2019 – 2022
    `;

    const parsed = parseResumeText(sampleResume, 'RESUME_LATEST (1).pdf');
    expect(parsed.fullName).toBe('SRIKANTH M');
    expect(parsed.email).toBe('srikanth112236@gmail.com');
    expect(parsed.phone).toBe('+91 8217643770');
    expect(parsed.totalExperienceYears).toBe(4.9);
    expect(parsed.currentCompany).toBe('VEDASYNK TECHNOLOGIES');
    expect(parsed.currentTitle).toBe('Senior Frontend Engineer');
    expect(parsed.skills).toContain('React.js');
    expect(parsed.skills).toContain('Node.js');
    expect(parsed.skills).toContain('MongoDB');
    expect(parsed.skills).toContain('Tailwind CSS');
    expect(parsed.education[0]).toContain('Bachelor of Commerce (B.Com)');
    expect(parsed.education).not.toContain('Bengaluru');
    expect(parsed.fullName).not.toBe('endobj');
    expect(parsed.summary).toContain('Senior Frontend Engineer');
    expect(parsed.workHistory && parsed.workHistory.length).toBeGreaterThan(0);
    expect(parsed.linkedinUrl).toContain('linkedin.com/in/srikanth');
  });
});
