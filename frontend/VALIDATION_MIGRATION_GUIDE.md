# NexaTalent — Form Validation Migration Guide

All forms now use real-time, layman-English validation. No technical jargon or raw data ever reaches the user.

## Files Already Completed (real-time validation wired)

| File | Forms | Status |
|------|-------|--------|
| `src/shared/validation.ts` | Core library (all rules + `useFormValidation` hook) | ✅ Created |
| `src/shared/ui/ValidatedField.tsx` | Drop-in `<input>`/`<textarea>` wrapper with validation | ✅ Created |
| `src/auth/pages/LoginPage.tsx` | Login, MFA, Forgot Password | ✅ Done |
| `src/auth/pages/CandidateRegisterPage.tsx` | 4-step candidate registration | ✅ Done |
| `src/auth/pages/EmployerRegisterPage.tsx` | 4-step employer registration | ✅ Done |
| `src/auth/pages/RecruiterRegisterPage.tsx` | Recruiter/agency registration | ✅ Done |
| `src/auth/pages/VendorRegisterPage.tsx` | Vendor partner registration | ✅ Done |
| `src/auth/components/MfaPanel.tsx` | MFA setup/verify/disable/admin reset | ✅ Done |
| `src/portals/candidate/CandidatePortal.tsx` | Profile form (name, email, phone, expected CTC) | ✅ Done |
| `src/portals/employer/EmployerPortal.tsx` | Job form (title + existing `validateJobForm`) | ✅ Done |
| `src/website/pages/ContactPage.tsx` | Contact enquiry form | ✅ Done |

## Validation Library — Available Rules

All rules return a plain-English message string or `undefined` when valid.

```ts
import {
  useFormValidation,
  required, email, phone, minLength, maxLength,
  number, min, max, url, match, date, after, combine,
} from '../../shared/validation';
```

| Rule | What it checks | Example message |
|------|---------------|-----------------|
| `required(label)` | Field is not empty | "Full name is required." |
| `email()` | Valid email format | "Please enter a valid email address." |
| `phone()` | Valid phone (7–15 digits) | "Please enter a valid phone number." |
| `minLength(n, label)` | Minimum character count | "Password needs at least 10 characters." |
| `maxLength(n, label)` | Maximum character count | "Message is too long (maximum 500 characters)." |
| `number(label)` | Is a valid number | "Please enter a valid number." |
| `min(n, label)` / `max(n, label)` | Number range | "Salary min must be at least 0." |
| `url(label)` | Valid website URL | "Please enter a valid website address." |
| `match(other, label, otherLabel)` | Two fields match | "Confirm password does not match Password." |
| `date(label)` | Valid date | "Please enter a valid date." |
| `after(other, label, otherLabel)` | Date is after another date | "End date must be after Start date." |
| `combine(r1, r2, ...)` | Run multiple rules, return first error | — |

## Pattern A: `useFormValidation` Hook (recommended for multi-field forms)

Best for forms with multiple related fields (registration, job creation, contact).

```tsx
import { useFormValidation, required, email } from '../../shared/validation';

// 1. Create the form with initial values + rules
const form = useFormValidation(
  { name: '', email: '', phone: '' },
  {
    name: [required('Full name')],
    email: [required('Email address'), email()],
    phone: [phone()],
  },
  { validateOnChange: true, validateOnBlur: true }
);

// 2. Wire each input
<input
  value={form.values.name}
  onChange={(e) => { setFormData({...formData, name: e.target.value}); form.setField('name', e.target.value); }}
  onBlur={() => form.setTouchedField('name')}
  className={`... ${form.errorFor('name') ? 'border-red-400' : ''}`}
/>
{form.errorFor('name') && <p className="text-xs text-red-600 font-bold">{form.errorFor('name')}</p>}

// 3. Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  const { isValid, validationMessages } = form.validateForm();
  if (!isValid) {
    setError(validationMessages[0] || 'Please fix the fields above.');
    return;
  }
  // ... submit to API
};
```

## Pattern B: `ValidatedField` Wrapper (fastest for single fields)

Drop-in replacement for `<input>` / `<textarea>`. Best for simple forms, modals, and EnterprisePanels CRUD forms.

```tsx
import { ValidatedField, fieldRules } from '../../shared/ui/ValidatedField';

// One line per field — validation + error display included:
<ValidatedField
  label="Email Address *"
  rules={fieldRules.email('Email address')}
  value={formData.email}
  onChange={(v) => setFormData({...formData, email: v})}
/>
```

Common presets in `fieldRules`:
- `fieldRules.required('Label')` — required only
- `fieldRules.email('Email address')` — required + valid email
- `fieldRules.phone('Phone number')` — required + valid phone
- `fieldRules.password(10)` — required + min 10 chars
- `fieldRules.name('Name')` — required + min 2 chars
- `fieldRules.url('Website address')` — valid URL (optional)
- `fieldRules.numberRange('Salary', 0, 1000000)` — number in range

## Applying to Remaining Forms

For each remaining form file, do these steps:

### Step 1: Add import
```tsx
import { useFormValidation, required, email, phone, minLength } from '../../shared/validation';
```

### Step 2: Create validation form near state
```tsx
const myForm = useFormValidation(
  { field1: '', field2: '' },
  {
    field1: [required('Field 1 label')],
    field2: [required('Field 2 label'), email()],
  },
  { validateOnChange: true, validateOnBlur: true }
);
```

### Step 3: Wire each input
Replace:
```tsx
value={formData.field1}
onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
```
With:
```tsx
value={formData.field1}
onChange={(e) => { setFormData({ ...formData, field1: e.target.value }); myForm.setField('field1', e.target.value); }}
onBlur={() => myForm.setTouchedField('field1')}
className={`... ${myForm.errorFor('field1') ? 'border-red-400 focus:border-red-400' : ''}`}
/>
{myForm.errorFor('field1') && <p className="text-xs text-red-600 font-bold mt-1">{myForm.errorFor('field1')}</p>}
```

### Step 4: Update submit handler
```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const { isValid, validationMessages } = myForm.validateForm();
  if (!isValid) {
    setError(validationMessages[0] || 'Please fill in the fields above.');
    return;
  }
  // ... existing API submit logic
};
```

### Step 5: Disable submit until valid
```tsx
<button type="submit" disabled={!myForm.isValid || isSubmitting}>
```

## Remaining Files to Migrate

| File | Forms | Priority |
|------|-------|----------|
| `src/website/pages/JobDetailPage.tsx` | Job application | High |
| `src/website/pages/PartnersPage.tsx` | Empanelment form | High |
| `src/website/components/HiringRequirementForm.tsx` | Hiring intake | High |
| `src/website/components/ai-engines/ClientThreeWayIntake.tsx` | 3-way intake | High |
| `src/website/components/ai-engines/VendorEmpanelmentForm.tsx` | Vendor empanelment | High |
| `src/website/components/MegaFooter.tsx` | Newsletter subscribe | Medium |
| `src/website/pages/InsightsPage.tsx` | Insights subscribe | Medium |
| `src/website/pages/HomePageV5.tsx` | Partner submit | Medium |
| `src/website/v2/sections/OfficesContact.tsx` | Contact form | Medium |
| `src/website/v2/pages/NewContactPage.tsx` | Contact form | Medium |
| `src/website/v2/pages/NewEmployersPage.tsx` | Hiring mandate | Medium |
| `src/website/v2/components/CareersApplyModal.tsx` | Job application modal | High |
| `src/website/v2/components/ServiceDetailModal.tsx` | Service request | High |
| `src/portals/recruiter/RecruiterPortal.tsx` | Agency, task, save edit | High |
| `src/portals/employee/EmployeePortal.tsx` | Task creation | Medium |
| `src/portals/vendor/VendorPortal.tsx` | Deploy contractor | Medium |
| `src/portals/superadmin/SuperAdminPortal.tsx` | Add tenant, add user | High |
| `src/portals/superadmin/SuperAdminDirectory.tsx` | Edit org, invite, user | High |
| `src/portals/superadmin/SuperAdmin360.tsx` | Invite, branch, verify | High |
| `src/portals/common/EnterprisePanels.tsx` | 30 CRUD forms | High |

## Backend Validation Status

`backend/src/validate/schemas.ts` defines Zod schemas. Body validation (`.safeParse`) is applied on:
- `auth/register/:type`, `commercial/*` mutations, `messaging/*`, `sales/lead`, `recruitment/*`

Still missing body validation on: `auth/login`, `auth/forgot-password`, `auth/reset-confirm`, all MFA endpoints, most directory/extended/sales CRUD, most reads.

**Recommendation:** Add Zod `safeParse` to all backend mutation routes to match frontend validation.

## Key Principles

1. **Layman English only** — messages like "Please enter a valid email address," never "ValidationError: email.invalid"
2. **Real-time** — validate on change (after first touch) and on blur
3. **No raw data** — never echo user input, stack traces, or system errors in messages
4. **Always server-validate** — frontend validation is UX; backend is the source of truth