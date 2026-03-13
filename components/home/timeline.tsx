// Copyright Ayush Singh 2021,2022. All Rights Reserved.
// Project: folio
// Author contact: https://www.linkedin.com/in/alphaayush/
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  Branch,
  BranchNode,
  CheckpointNode,
  ItemSize,
  MENULINKS,
  NodeTypes,
  TIMELINE,
  TimelineNodeV2,
} from "../../constants";
import { gsap, Linear } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { IDesktop, isSmallScreen } from "pages";

const svgColor = "#9CA3AF";
const animColor = "#FCD34D";
const separation = 400;
const strokeWidth = 2;
const leftBranchX = 13;
const curveLength = 150;
const dotSize = 26;

const TimelineSection = ({ isDesktop }: IDesktop) => {
  const [svgWidth, setSvgWidth] = useState(400);
  const [rightBranchX, setRightBranchX] = useState(109);

  const svgCheckpointItems = TIMELINE.filter(
    (item) => item.type === NodeTypes.CHECKPOINT && item.shouldDrawLine
  );

  const svgLength = svgCheckpointItems?.reduce(
    (sum, item) => sum + ((item as CheckpointNode).separation ?? separation),
    0
  );

  const timelineSvg: MutableRefObject<SVGSVGElement> = useRef(null);
  const svgContainer: MutableRefObject<HTMLDivElement> = useRef(null);

  const addNodeRefsToItems = (
    timeline: Array<TimelineNodeV2>
  ): Array<LinkedTimelineNode> => {
    return timeline.map((node, idx) => ({
      ...node,
      next: timeline[idx + 1],
      prev: timeline[idx - 1],
    }));
  };

  const generateTimelineSvg = (timeline: Array<TimelineNodeV2>): string => {
    let index = 1;
    let y = dotSize / 2;
    const timelineStyle = `<style>.str, .dot{stroke-width: ${strokeWidth}px}.anim-branch{stroke-dasharray: 186}</style>`;
    let isDiverged = false;

    const timelineSvg = addNodeRefsToItems(timeline).reduce(
      (svg: string, node: LinkedTimelineNode) => {
        const { type, next } = node;
        let lineY = y;
        let dotY = y + separation / 2;

        switch (type) {
          case NodeTypes.CHECKPOINT:
            {
              const { shouldDrawLine } = node;
              const nodeSeparation =
                (node as CheckpointNode).separation ?? separation;

              // special handling for last checkpoint
              if (!next) {
                lineY = y - nodeSeparation / 2;
              }

              // special handling for dot without line
              if (!shouldDrawLine) {
                dotY = y;
              } else {
                dotY = y + nodeSeparation / 2;
              }

              if (shouldDrawLine) {
                svg = shouldDrawLine
                  ? `${drawLine(node, lineY, index, isDiverged, nodeSeparation)}${svg}`
                  : svg;
                y = y + nodeSeparation;
                index++;
              }

              const contentHeight = shouldDrawLine ? nodeSeparation : separation;
              svg = svg.concat(drawDot(node, dotY, isDiverged, contentHeight));
            }
            break;
          case NodeTypes.DIVERGE:
            {
              isDiverged = true;

              svg = `${drawBranch(node, y, index)}${svg}`;
            }
            break;
          case NodeTypes.CONVERGE:
            {
              isDiverged = false;

              // Drawing CONVERGE branch with previous line and index
              svg = `${drawBranch(node, y - separation, index - 1)}${svg}`;
            }
            break;
        }

        return svg;
      },
      timelineStyle
    );

    return timelineSvg;
  };

  const getDotString = (x: number, y: number) => {
    return `<rect class='dot' width=${dotSize} height=${dotSize} fill='#111827' x=${
      x - dotSize / 2
    } y=${
      y - dotSize / 2
    } ></rect><circle cx=${x} cy=${y} r='7' stroke=${svgColor} class='dot' ></circle>`;
  };

  const drawDot = (
    timelineNode: LinkedCheckpointNode,
    y: number,
    isDiverged: boolean,
    contentHeight: number = separation
  ) => {
    const { next, alignment } = timelineNode as LinkedCheckpointNode;

    // Diverging
    if (next && next.type === NodeTypes.DIVERGE) {
      y = y - curveLength + 6 * dotSize;
    }

    // Converging
    if (next && next.type === NodeTypes.CONVERGE) {
      y = y + curveLength - 6 * dotSize;
    }

    const dotString = getDotString(
      alignment === Branch.LEFT ? leftBranchX : rightBranchX,
      y
    );

    const textString = addText(timelineNode, y, isDiverged, contentHeight);

    return `${textString}${dotString}`;
  };

  const addText = (
    timelineNode: LinkedCheckpointNode,
    y: number,
    isDiverged: boolean,
    contentHeight: number = separation
  ) => {
    const { title, subtitle, size, image } = timelineNode;

    const offset = isDiverged ? rightBranchX : 10;
    const foreignObjectX = dotSize / 2 + 10 + offset;
    const foreignObjectY = y - dotSize / 2;
    const foreignObjectWidth = svgWidth - (dotSize / 2 + 10 + offset);

    const titleSizeClass = size === ItemSize.LARGE ? "text-6xl" : "text-3xl";
    const titleStyle =
      size === ItemSize.LARGE
        ? ""
        : "color:#6dd5ed;font-weight:600;";
    const logoString = image
      ? `<img src='${image}' class='h-8 mb-2' loading='lazy' width='100' height='32' alt='${image}' />`
      : "";
    const subtitleString = subtitle
      ? `<p class='text-lg mt-2 font-medium tracking-wide' style='color:#94a3b8'>${subtitle}</p>`
      : "";

    return `<foreignObject x=${foreignObjectX} y=${foreignObjectY} width=${foreignObjectWidth} 
        height=${contentHeight}><p class='${titleSizeClass}' style='${titleStyle}'>${title}</p>${subtitleString}</foreignObject>`;
  };

  const drawLine = (
    timelineNode: LinkedCheckpointNode,
    y: number,
    i: number,
    isDiverged: boolean,
    segmentSeparation: number = separation
  ) => {
    const { alignment, prev, next } = timelineNode as LinkedCheckpointNode;

    const isPrevDiverge = prev && prev.type === NodeTypes.DIVERGE;
    const isNextConverge = next && next.type === NodeTypes.CONVERGE;

    const lineY = Math.abs(y + segmentSeparation);

    // Smaller line for Diverging
    if (isPrevDiverge) {
      return `<line class='str' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${animColor} />`;
    }

    // Smaller line for Converging
    if (isNextConverge) {
      return `<line class='str' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${animColor} />`;
    }

    const lineX = alignment === Branch.LEFT ? leftBranchX : rightBranchX;

    let str = `<line class='str' x1=${lineX} y1=${y} x2=${lineX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${lineX} y1=${y} x2=${lineX} y2=${lineY} stroke=${animColor} />`;

    // If already diverged, draw parallel line to the existing line
    if (isDiverged) {
      const divergedLineX =
        alignment === Branch.LEFT ? rightBranchX : leftBranchX;
      str = str.concat(
        `<line class='str' x1=${divergedLineX} y1=${y} x2=${divergedLineX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${divergedLineX} y1=${y} x2=${divergedLineX} y2=${lineY} stroke=${animColor} />`
      );
    }
    return str;
  };

  const drawBranch = (timelineNode: LinkedBranchNode, y: number, i: number) => {
    const { type } = timelineNode;

    switch (type) {
      case NodeTypes.DIVERGE:
        return `<path class='str' d='M ${leftBranchX} ${y} C ${leftBranchX} ${
          y + curveLength / 2
        } ${rightBranchX} ${y + curveLength / 2} ${rightBranchX} ${
          y + curveLength
        }' stroke=${svgColor} /><line class='str' x1=${rightBranchX} y1=${
          y + curveLength
        } x2=${rightBranchX} y2=${
          y + separation
        } stroke=${svgColor} /><path class='str anim-branch branch-${i}' d='M ${leftBranchX} ${y} C ${leftBranchX} ${
          y + curveLength / 2
        } ${rightBranchX} ${y + curveLength / 2} ${rightBranchX} ${
          y + curveLength
        }' stroke=${animColor} /><line class='str branch-line-${i}' x1=${rightBranchX} y1=${
          y + curveLength
        } x2=${rightBranchX} y2=${y + separation} stroke=${animColor} />`;
      case NodeTypes.CONVERGE:
        return `<path class='str' d='M ${rightBranchX} ${
          y + separation - curveLength
        } C ${rightBranchX} ${
          y + separation - curveLength + curveLength / 2
        } ${leftBranchX} ${
          y + separation - curveLength + curveLength / 2
        } ${leftBranchX} ${
          y + separation
        }' stroke=${svgColor} /><line class='str' x1=${rightBranchX} y1=${y} x2=${rightBranchX} y2=${Math.abs(
          y + separation - curveLength
        )} stroke=${svgColor} /><path class='str anim-branch branch-${i}' d='M ${rightBranchX} ${
          y + separation - curveLength
        } C ${rightBranchX} ${
          y + separation - curveLength + curveLength / 2
        } ${leftBranchX} ${
          y + separation - curveLength + curveLength / 2
        } ${leftBranchX} ${
          y + separation
        }' stroke=${animColor} /><line class='str branch-line-${i}' x1=${rightBranchX} y1=${y} x2=${rightBranchX} y2=${Math.abs(
          y + separation - curveLength
        )} stroke=${animColor} />`;
      default:
        return "";
    }
  };

  const addLineSvgAnimation = (
    timeline: GSAPTimeline,
    duration: number,
    index: number
  ): GSAPTimeline => {
    const startTime = `start+=${duration * index}`;

    timeline.from(
      svgContainer.current.querySelectorAll(`.line-${index + 1}`),
      { scaleY: 0, duration },
      startTime
    );

    return timeline;
  };

  const addDivergingBranchLineAnimation = (
    timeline: GSAPTimeline,
    duration: number,
    index: number
  ): GSAPTimeline => {
    timeline
      .from(
        svgContainer.current.querySelector(`.line-${index + 1}`),
        { scaleY: 0, duration },
        `start+=${duration * index}`
      )
      .from(
        svgContainer.current.querySelector(`.branch-${index + 1}`),
        { strokeDashoffset: 186, duration: duration - 2 },
        `start+=${duration * index}`
      )
      .from(
        svgContainer.current.querySelector(`.branch-line-${index + 1}`),
        { scaleY: 0, duration: duration - 1 },
        `start+=${duration * (index + 1) - 2}`
      );

    return timeline;
  };

  const addConvergingBranchLineAnimation = (
    timeline: GSAPTimeline,
    duration: number,
    index: number
  ): GSAPTimeline => {
    timeline
      .from(
        svgContainer.current.querySelector(`.line-${index + 1}`),
        { scaleY: 0, duration },
        `start+=${duration * index}`
      )
      .from(
        svgContainer.current.querySelector(`.branch-line-${index + 1}`),
        { scaleY: 0, duration: duration - 1 },
        `start+=${duration * index}`
      )
      .from(
        svgContainer.current.querySelector(`.branch-${index + 1}`),
        { strokeDashoffset: 186, duration: duration - 2 },
        `start+=${duration * (index + 1) - 1}`
      );

    return timeline;
  };

  const animateTimeline = (timeline: GSAPTimeline, duration: number): void => {
    let index = 0;

    addNodeRefsToItems(TIMELINE).forEach((item) => {
      const { type } = item;

      if (type === NodeTypes.CHECKPOINT && item.shouldDrawLine) {
        const { next, prev } = item;

        if (prev?.type === NodeTypes.DIVERGE) {
          addDivergingBranchLineAnimation(timeline, duration, index);
        } else if (next?.type === NodeTypes.CONVERGE) {
          addConvergingBranchLineAnimation(timeline, duration, index);
        } else {
          addLineSvgAnimation(timeline, duration, index);
        }

        index++;
      }
    });
  };

  const setTimelineSvg = (
    svgContainer: MutableRefObject<HTMLDivElement>,
    timelineSvg: MutableRefObject<SVGSVGElement>
  ) => {
    const containerWidth = svgContainer.current.clientWidth;
    setSvgWidth(containerWidth);

    const resultSvgString = generateTimelineSvg(TIMELINE);
    timelineSvg.current.innerHTML = resultSvgString;

    if (isSmallScreen()) {
      setRightBranchX(70);
    }
  };

  const initScrollTrigger = (): {
    timeline: GSAPTimeline;
    duration: number;
  } => {
    const timeline = gsap
      .timeline({ defaults: { ease: Linear.easeNone, duration: 0.44 } })
      .addLabel("start");

    const trigger = svgContainer.current;
    const start = "top center";
    const end = `+=${svgLength}`;
    const duration = 3;
    const additionalConfig = {};

    ScrollTrigger.create({
      ...additionalConfig,
      trigger,
      start,
      end,
      scrub: 0,
      animation: timeline,
    });
    return { timeline, duration };
  };

  useEffect(() => {
    // Generate and set the timeline svg
    setTimelineSvg(svgContainer, timelineSvg);

    const { timeline, duration }: { timeline: GSAPTimeline; duration: number } =
      initScrollTrigger();

    // Animation for Timeline SVG
    animateTimeline(timeline, duration);
  }, [
    timelineSvg,
    svgContainer,
    svgWidth,
    rightBranchX,
    svgCheckpointItems.length,
    svgLength,
  ]);

  const renderSVG = (): React.ReactNode => (
    <svg
      width={svgWidth}
      height={svgLength}
      viewBox={`0 0 ${svgWidth} ${svgLength}`}
      fill="none"
      ref={timelineSvg}
    ></svg>
  );

  const renderSectionTitle = (): React.ReactNode => (
    <div className="flex flex-col items-center text-center">
      <p className="section-title-sm seq">PROFESSIONAL JOURNEY</p>
      <h1 className="section-heading seq mt-2">Experience</h1>
      <h2 className="text-2xl md:max-w-2xl w-full seq mt-2">
        A brief overview of my professional milestones
      </h2>
    </div>
  );

  return (
    <section
      className="w-full relative select-none min-h-screen section-container py-8 flex flex-col justify-center"
      id={MENULINKS[3].ref}
    >
      {renderSectionTitle()}
      <div className="grid grid-cols-12 gap-4 mt-20 max-w-6xl mx-auto w-full relative">
        <div className="col-span-12 relative min-h-[400px]">
          <div
            className="relative left-1/2 -translate-x-[13px] w-fit"
            ref={svgContainer}
          >
            {renderSVG()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;

type LinkedTimelineNode = LinkedCheckpointNode | LinkedBranchNode;

type LinkedCheckpointNode = LinkNode & CheckpointNode;

type LinkedBranchNode = LinkNode & BranchNode;

interface LinkNode {
  next?: LinkedTimelineNode;
  prev?: LinkedTimelineNode;
}
