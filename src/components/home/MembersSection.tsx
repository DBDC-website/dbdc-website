'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import {
  aboutDbdc,
  administrator,
  memberGroups,
  type MemberGroup,
} from '@/constants/about';

function MemberAccordion({ group, index }: { group: MemberGroup; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `member-group-${index}`;
  const buttonId = `member-group-button-${index}`;

  return (
    <div className="border-b border-stone-200">
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 py-4 text-left"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="font-semibold text-brand-900">{group.title}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-stone-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
        <ul className="space-y-2 pb-4 pl-1">
          {group.members.map((member) => (
            <li key={member} className="text-stone-700">
              {member}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function MembersSection() {
  return (
    <Section id="membership" tone="default" aria-labelledby="members-heading">
      <SectionHeading
        id="members-heading"
        eyebrow="Membership"
        title="Members"
      />
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700">
        {aboutDbdc.membersIntro}
      </p>

      <div className="mt-8 max-w-2xl">
        {memberGroups.map((group, index) => (
          <MemberAccordion key={group.title} group={group} index={index} />
        ))}

        <p className="mt-6 text-stone-700">
          <span className="font-semibold text-brand-900">Administrator:</span>{' '}
          {administrator}
        </p>
      </div>
    </Section>
  );
}
