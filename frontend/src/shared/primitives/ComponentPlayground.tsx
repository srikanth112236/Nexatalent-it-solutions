import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Badge,
  Avatar,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Card,
  StatCard,
  Table,
  Accordion,
  Tabs,
  Skeleton,
  EmptyState,
  ErrorState,
  Modal,
  Drawer,
} from './index';

interface SampleCandidate {
  id: string;
  name: string;
  role: string;
  status: string;
  experience: string;
}

const sampleData: SampleCandidate[] = [
  { id: '1', name: 'Alex Rivera', role: 'Staff Cloud Architect', status: 'Shortlisted', experience: '11 yrs' },
  { id: '2', name: 'Elena Rostova', role: 'Principal Security Lead', status: 'Interviewing', experience: '9 yrs' },
  { id: '3', name: 'Marcus Chen', role: 'VP Engineering', status: 'Offered', experience: '15 yrs' },
];

export function ComponentPlayground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const tableColumns = [
    { key: 'name', header: 'Candidate Name' },
    { key: 'role', header: 'Designation' },
    {
      key: 'status',
      header: 'Stage',
      render: (row: SampleCandidate) => (
        <Badge variant={row.status === 'Offered' ? 'success' : row.status === 'Interviewing' ? 'primary' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    { key: 'experience', header: 'Exp' },
  ];

  const accordionItems = [
    {
      id: 'acc-1',
      title: 'How does NexaTalent verify senior technical competencies?',
      content: 'Every candidate in our curated talent pool undergoes structured technical peer screening, architecture evaluation, and reference verification before submission to hiring teams.',
    },
    {
      id: 'acc-2',
      title: 'What engagement models are supported?',
      content: 'We support permanent executive search, contract staffing, volume GCC ramp-ups, and recruitment process outsourcing (RPO).',
    },
  ];

  const tabItems = [
    {
      id: 'active-roles',
      label: 'Active Requisitions (12)',
      content: (
        <Card variant="elevated" padding="md">
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Active Executive Mandates</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Displaying prioritized mandates requiring talent pipeline qualification.
          </p>
        </Card>
      ),
    },
    {
      id: 'recent-interviews',
      label: 'Scheduled Interviews (4)',
      content: (
        <Card variant="elevated" padding="md">
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Upcoming Panel Evaluations</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            All technical rounds synchronized with hiring team calendars.
          </p>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Badge variant="primary">Phase 3 Component Library</Badge>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/website-components" style={{ color: 'var(--color-primary-400)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 700, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
              ✦ 40 Website Components (Phase 4)
            </Link>
            <Link to="/design-system" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
              &larr; Design Tokens
            </Link>
            <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
              Website Home &rarr;
            </Link>
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Foundation Component Playground
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Interactive catalog validating all atomic UI primitives, form controls, surfaces, overlays, and feedback states.
        </p>
      </header>

      {/* 1. Buttons */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          1. Button Variants & States
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Destructive Action</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button size="sm" variant="primary">Small (34px)</Button>
          <Button size="md" variant="primary">Medium (44px min)</Button>
          <Button size="lg" variant="primary">Large (52px)</Button>
          <Button
            variant="secondary"
            isLoading={btnLoading}
            onClick={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 2000);
            }}
          >
            {btnLoading ? 'Processing...' : 'Click for Loading State'}
          </Button>
          <Button variant="primary" disabled>Disabled State</Button>
        </div>
      </section>

      {/* 2. Badges & Avatars */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          2. Badges & Avatars
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
          <Badge variant="default">Default Stage</Badge>
          <Badge variant="primary">Active Pipeline</Badge>
          <Badge variant="success">Offer Accepted</Badge>
          <Badge variant="warning">Awaiting Review</Badge>
          <Badge variant="danger">Disqualified</Badge>
          <Badge variant="accent">Top 1% Talent</Badge>
          <Badge variant="primary" pill={false}>Square Badge</Badge>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Avatar name="Sarah Connor" size="sm" />
          <Avatar name="David Miller" size="md" />
          <Avatar name="Maya Patel" size="lg" />
          <Avatar name="NexaTalent Platform" size="xl" />
        </div>
      </section>

      {/* 3. Form Controls */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          3. Form Controls & Validation
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <FormField label="Full Legal Name" required helperText="As indicated on official identification">
            <Input placeholder="e.g. Rachel Adams" defaultValue="Rachel Adams" />
          </FormField>

          <FormField label="Candidate Email" error="Please enter a valid business email address">
            <Input type="email" placeholder="email@company.com" error defaultValue="invalid-email" />
          </FormField>

          <FormField label="Hiring Track" required>
            <Select
              options={[
                { value: 'engineering', label: 'Cloud & Infrastructure Engineering' },
                { value: 'product', label: 'Product & Design Leadership' },
                { value: 'executive', label: 'Executive Management' },
              ]}
            />
          </FormField>

          <FormField label="Candidate Bio / Notes">
            <Textarea placeholder="Add candidate background notes..." defaultValue="Proven track record in Kubernetes distributed systems." />
          </FormField>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Checkbox label="Send automated interview reminder via SMS" defaultChecked />
          <Switch
            label="Enable Two-Factor Authentication"
            checked={switchChecked}
            onChange={setSwitchChecked}
          />
        </div>
      </section>

      {/* 4. StatCards & Surfaces */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          4. StatCards & Surfaces
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <StatCard label="Talent Sourced" value="1,420" change="+14.2%" isPositive={true} subtitle="vs last month" />
          <StatCard label="Shortlist Conversion" value="68.4%" change="+4.1%" isPositive={true} subtitle="Industry benchmark: 42%" />
          <StatCard label="Time to Shortlist" value="4.2 days" change="-1.1 days" isPositive={true} subtitle="Target: 5 days" />
          <StatCard label="Unfilled Mandates" value="3" change="+2" isPositive={false} subtitle="Requires sourcing review" />
        </div>
      </section>

      {/* 5. Responsive Data Table */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          5. Data Table Primitive
        </h2>
        <Table
          columns={tableColumns}
          data={sampleData}
          keyExtractor={(row) => row.id}
        />
      </section>

      {/* 6. Tabs & Accordion */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          6. Tabs & Accordions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Tabs Primitive</h3>
            <Tabs tabs={tabItems} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Accordion Primitive</h3>
            <Accordion items={accordionItems} />
          </div>
        </div>
      </section>

      {/* 7. Feedback & Skeletons */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          7. Loading & State Fallbacks
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card variant="elevated" padding="md">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Skeleton Shimmer</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton width={40} height={40} borderRadius="50%" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Skeleton height="0.875rem" width="60%" />
                  <Skeleton height="0.75rem" width="40%" />
                </div>
              </div>
              <Skeleton height="3rem" />
            </div>
          </Card>

          <EmptyState
            title="No Candidates in Stage"
            description="There are currently no candidates awaiting feedback in this stage."
            actionLabel="Source Candidates"
            onAction={() => alert('Trigger sourcing pipeline')}
          />

          <ErrorState
            message="Unable to connect to talent graph. Verify your network connection."
            onRetry={() => alert('Retrying fetch...')}
          />
        </div>
      </section>

      {/* 8. Overlays: Modal & Drawer */}
      <section>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          8. Accessible Overlays (Modal & Drawer)
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Test Modal
          </Button>
          <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
            Open Test Drawer
          </Button>
        </div>

        {/* Modal Instance */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Candidate Evaluation Panel"
          description="Submit scorecards and qualitative notes for Elena Rostova."
          footer={
            <>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Submit Scorecard
              </Button>
            </>
          }
        >
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Confirm that the technical review meets role requirements for Cloud Security Lead.
          </p>
        </Modal>

        {/* Drawer Instance */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Candidate Dossier"
          footer={
            <Button variant="primary" style={{ width: '100%' }} onClick={() => setIsDrawerOpen(false)}>
              Schedule Technical Round
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Avatar name="Elena Rostova" size="lg" />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Elena Rostova</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Principal Security Architect</p>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              9 years of experience designing zero-trust enterprise cloud security architectures.
            </p>
          </div>
        </Drawer>
      </section>
    </div>
  );
}
