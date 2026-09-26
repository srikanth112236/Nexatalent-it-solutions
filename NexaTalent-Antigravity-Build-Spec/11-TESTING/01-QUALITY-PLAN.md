# Quality Plan

## Website QA

### Visual

- desktop
- tablet
- mobile
- wide desktop
- typography
- spacing
- image quality
- responsive navigation
- footer
- forms

### Functional

- all links
- all forms
- job search
- job detail
- filters
- pagination
- login entry
- CTA routes
- 404

### Accessibility

- keyboard-only navigation
- focus visibility
- semantic headings
- labels
- screen-reader names
- contrast
- reduced motion
- dialog focus management
- touch targets

### Performance

- optimized images
- lazy loading
- route-level code splitting
- minimized blocking JavaScript
- efficient fonts
- no unnecessary animation loops

## Portal QA

Test every role against:

- allowed route
- forbidden route
- allowed API
- forbidden API
- cross-organization resource
- modified resource ID
- document access
- export
- bulk operation

## Security test examples

1. Candidate attempts employer route.
2. Employer modifies another employer's resource ID.
3. Recruiter requests unauthorized employee data.
4. User loses permission during an active session.
5. Deactivated user calls API directly.
6. Expired session calls protected API.
7. Unauthorized user accesses document URL.
8. Search query attempts to reveal hidden records.

## Definition of done

A feature is not complete until:

- UI works
- API works
- validation works
- authorization works
- loading/empty/error states work
- responsive behavior works
- accessibility works
- audit requirements are satisfied
- tests pass
- no console errors remain
