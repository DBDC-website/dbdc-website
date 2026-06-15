'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  aboutDbdc,
  administrator,
  memberGroups,
  type MemberGroup,
} from '@/constants/about';

function MemberAccordion({ group }: { group: MemberGroup }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900">{group.title}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <ul className="space-y-2 pb-4 pl-1">
          {group.members.map((member) => (
            <li key={member} className="text-gray-700">
              {member}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MembersSection() {
  return (
    <section className="border-t border-gray-200 py-16" aria-labelledby="members-heading">
      <h2
        id="members-heading"
        className="text-2xl font-bold text-gray-900 md:text-3xl"
      >
        Members
      </h2>
      <p className="mt-6 max-w-3xl leading-relaxed text-gray-700">
        {aboutDbdc.membersIntro}
      </p>

      <div className="mt-8 max-w-2xl">
        {memberGroups.map((group) => (
          <MemberAccordion key={group.title} group={group} />
        ))}

        <p className="mt-6 text-gray-700">
          <span className="font-semibold text-gray-900">Administrator:</span>{' '}
          {administrator}
        </p>
      </div>
    </section>
  );
}
