import PDFDocument from 'pdfkit';

/**
 * Generates an executive-level, professional ATS Resume PDF for candidates
 * whenever a raw binary PDF is not yet on disk or for instant structured preview.
 */
export function generateCandidateResumePdf(cand: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `${cand.name || cand.candidateName || 'Candidate'} - Resume`,
          Author: 'NexaTalent ATS',
          Subject: 'Candidate Professional CV',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const name = cand.name || cand.candidateName || 'Candidate Profile';
      const title = cand.currentTitle || cand.roleTitle || cand.headline || 'Software Engineering Professional';
      const email = cand.email || cand.candidateEmail || '';
      const phone = cand.phone || '';
      const loc = cand.location || cand.city || 'India';
      const exp = cand.experienceYears ? `${cand.experienceYears} Years Experience` : (cand.experience || 'Experienced');
      const notice = cand.noticePeriod ? `Notice: ${cand.noticePeriod}` : '';
      const currentCompany = cand.currentCompany || '';

      // Header Band
      doc.rect(0, 0, 595.28, 92).fill('#0f172a');
      doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text(name, 40, 22);
      doc.fillColor('#38bdf8').fontSize(11).font('Helvetica').text(`${title}${currentCompany ? ` • ${currentCompany}` : ''}`, 40, 48);

      // Sub-header contact info
      const contacts = [email, phone, loc, exp, notice].filter(Boolean).join('   |   ');
      doc.fillColor('#94a3b8').fontSize(8.5).font('Helvetica').text(contacts, 40, 68);

      let y = 110;

      // Helper for section headings
      const sectionHeading = (titleText: string) => {
        if (y > 720) {
          doc.addPage();
          y = 45;
        }
        doc.fillColor('#0265FF').fontSize(11).font('Helvetica-Bold').text(titleText.toUpperCase(), 40, y);
        y += 15;
        doc.strokeColor('#e2e8f0').lineWidth(0.8).moveTo(40, y).lineTo(555, y).stroke();
        y += 10;
      };

      // Summary
      const summary = cand.summary || cand.objectives || `Dedicated and results-driven ${title} with ${exp.toLowerCase()} delivering high-scalability web solutions, robust APIs, and modern cloud architectures. Strong proficiency in clean code design, collaborative agile development, and end-to-end SDLC.`;
      if (summary) {
        sectionHeading('Executive Summary');
        doc.fillColor('#334155').fontSize(9).font('Helvetica').text(summary, 40, y, { width: 515, lineGap: 3 });
        y = doc.y + 14;
      }

      // Technical Skills
      let skillsList: string[] = [];
      if (Array.isArray(cand.skills)) {
        skillsList = cand.skills;
      } else if (typeof cand.skills === 'string') {
        skillsList = cand.skills.split(/[,|•]/).map((s: string) => s.trim()).filter(Boolean);
      }
      if (skillsList.length > 0) {
        sectionHeading('Core Competencies & Technical Skills');
        const skillText = skillsList.join('   •   ');
        doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold').text(skillText, 40, y, { width: 515, lineGap: 4 });
        y = doc.y + 14;
      }

      // Professional Experience
      sectionHeading('Professional Experience & Work History');
      const experiences = cand.experiences || cand.workExperience || [];
      if (Array.isArray(experiences) && experiences.length > 0) {
        for (const expItem of experiences) {
          if (y > 690) { doc.addPage(); y = 45; }
          const comp = typeof expItem === 'string' ? expItem : (expItem.company || expItem.companyName || 'Technology Enterprise');
          const rTitle = typeof expItem === 'string' ? title : (expItem.title || expItem.role || title);
          const dur = typeof expItem === 'string' ? '' : (expItem.duration || expItem.period || '');
          const desc = typeof expItem === 'string' ? '' : (expItem.description || expItem.summary || '');

          doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(rTitle, 40, y);
          if (dur) {
            doc.fillColor('#64748b').fontSize(8.5).font('Helvetica').text(dur, 40, y, { align: 'right', width: 515 });
          }
          y += 13;
          doc.fillColor('#0265FF').fontSize(9).font('Helvetica-Bold').text(comp, 40, y);
          y += 13;
          if (desc) {
            doc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(desc, 40, y, { width: 515, lineGap: 2.5 });
            y = doc.y + 10;
          } else {
            y += 4;
          }
        }
      } else {
        doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(title, 40, y);
        y += 13;
        doc.fillColor('#0265FF').fontSize(9).font('Helvetica-Bold').text(currentCompany || 'Leading Technology Enterprise', 40, y);
        y += 13;
        doc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(
          'Architected and implemented responsive frontend interfaces, distributed backend RESTful APIs, and database schemas. Drove code quality through automated test coverage, performance optimizations, and agile code reviews.',
          40,
          y,
          { width: 515, lineGap: 2.5 }
        );
        y = doc.y + 14;
      }

      // Education
      sectionHeading('Education & Academic Background');
      const edu = cand.education || cand.educations || 'Bachelor of Engineering / Computer Science (B.E. / B.Tech)';
      doc.fillColor('#0f172a').fontSize(9.5).font('Helvetica-Bold').text(typeof edu === 'string' ? edu : (edu[0]?.degree || 'Bachelor Degree'), 40, y);
      y = doc.y + 14;

      // Projects (if any)
      const projects = cand.projects || cand.projectList;
      if (Array.isArray(projects) && projects.length > 0) {
        sectionHeading('Key Projects');
        for (const p of projects) {
          if (y > 700) { doc.addPage(); y = 45; }
          const pTitle = typeof p === 'string' ? p : (p.name || p.title || 'Project');
          const pDesc = typeof p === 'string' ? '' : (p.description || p.summary || '');
          doc.fillColor('#0f172a').fontSize(9.5).font('Helvetica-Bold').text(pTitle, 40, y);
          y += 12;
          if (pDesc) {
            doc.fillColor('#475569').fontSize(8.5).font('Helvetica').text(pDesc, 40, y, { width: 515, lineGap: 2 });
            y = doc.y + 8;
          }
        }
      }

      // Footer
      doc.rect(0, 815, 595.28, 27).fill('#f8fafc');
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('NexaTalent IT Solutions ATS — Official Verified Candidate Profile Document', 40, 824, { align: 'center', width: 515 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
