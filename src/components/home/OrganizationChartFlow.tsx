'use client';

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  orgChartEdges,
  orgChartNodes,
  type OrgNode,
  type OrgNodeId,
} from '@/constants/orgChart';
import { cn } from '@/lib/cn';

const VIEW_W = 1120;
const VIEW_H = 640;

function NodeBox({
  node,
  active,
  dimmed,
  mosaicFillId,
  onHover,
  onLeave,
}: {
  node: OrgNode;
  active: boolean;
  dimmed: boolean;
  mosaicFillId: string;
  onHover: () => void;
  onLeave: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const x = node.x - node.w / 2;
  const y = node.y - node.h / 2;

  return (
    <motion.g
      role="listitem"
      tabIndex={0}
      aria-label={`${node.en}. ${node.zh}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className="cursor-pointer outline-none"
      animate={
        reduceMotion
          ? undefined
          : {
              scale: active ? 1.04 : 1,
              opacity: dimmed ? 0.5 : 1,
            }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
    >
      <motion.rect
        x={x - 10}
        y={y - 10}
        width={node.w + 20}
        height={node.h + 20}
        rx={10}
        fill="url(#org-node-glow)"
        animate={
          reduceMotion
            ? { opacity: active ? 0.9 : 0 }
            : active
              ? { opacity: [0.55, 0.95, 0.55], scale: [1, 1.04, 1] }
              : { opacity: 0, scale: 0.92 }
        }
        transition={
          active && !reduceMotion
            ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.35 }
        }
        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
      />

      <rect
        x={x}
        y={y}
        width={node.w}
        height={node.h}
        rx={6}
        fill={`url(#${mosaicFillId})`}
        className={cn(
          'stroke-[1.5]',
          active ? 'stroke-[#00a0dc]' : 'stroke-brand-800/70',
        )}
        style={{
          filter: active
            ? 'drop-shadow(0 0 12px rgba(0,160,220,0.55)) drop-shadow(0 0 24px rgba(210,167,60,0.4))'
            : 'drop-shadow(0 1px 4px rgba(27,39,64,0.1))',
        }}
      />

      <rect
        x={x}
        y={y}
        width={node.w}
        height={node.h}
        rx={6}
        className="pointer-events-none fill-white/30"
      />

      {node.emphasized ? (
        <rect
          x={x + 3}
          y={y + 3}
          width={node.w - 6}
          height={node.h - 6}
          rx={4}
          className="fill-none stroke-brand-800/70"
          strokeWidth={1}
        />
      ) : null}

      <foreignObject x={x} y={y} width={node.w} height={node.h}>
        <div
          className={cn(
            'flex h-full flex-col items-center justify-center px-2.5 text-center transition-[color,text-shadow] duration-300',
            active
              ? 'text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_22px_rgba(0,160,220,0.35)]'
              : 'text-brand-950',
          )}
        >
          <span className="text-[13px] font-semibold leading-snug sm:text-sm lg:text-[15px]">
            {node.en}
          </span>
          <span
            className={cn(
              'mt-1 text-xs leading-snug sm:text-[13px]',
              active ? 'text-[#0a6f96]' : 'text-brand-800',
            )}
          >
            {node.zh}
          </span>
        </div>
      </foreignObject>
    </motion.g>
  );
}

/**
 * Interactive DBDC organization flowchart.
 * Hovering a node glows that box only (lines stay static).
 */
export default function OrganizationChartFlow({
  className,
}: {
  className?: string;
}) {
  const reactId = useId();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<OrgNodeId | null>(null);
  const mosaicFillId = `${reactId}-mosaic`;

  return (
    <figure className={cn('flex h-full min-h-[20rem] w-full flex-col', className)}>
      <figcaption className="mb-2 shrink-0 text-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-950 [text-shadow:0_0_14px_rgba(255,255,255,0.95),0_0_28px_rgba(0,160,220,0.3)] sm:text-base">
        Organization
      </figcaption>

      <div className="relative min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="size-full"
          role="list"
          aria-label="DBDC organization structure"
        >
          <defs>
            {/* Same blue → cream → peach gradient inside every box */}
            <linearGradient
              id={mosaicFillId}
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#cfeef9" />
              <stop offset="40%" stopColor="#fff8eb" />
              <stop offset="100%" stopColor="#f5d4b0" />
            </linearGradient>
            <radialGradient id="org-node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,160,220,0.45)" />
              <stop offset="45%" stopColor="rgba(210,167,60,0.28)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {orgChartEdges.map((edge) => (
            <path
              key={edge.id}
              d={edge.d}
              fill="none"
              stroke="rgba(17,26,44,0.88)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={edge.dashed ? '6 5' : undefined}
            />
          ))}

          {orgChartNodes.map((node) => (
            <NodeBox
              key={node.id}
              node={node}
              active={hovered === node.id}
              dimmed={hovered != null && hovered !== node.id}
              mosaicFillId={mosaicFillId}
              onHover={() => setHovered(node.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </svg>
      </div>
    </figure>
  );
}
