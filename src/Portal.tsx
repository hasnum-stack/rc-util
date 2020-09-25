import * as React from 'react';
import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import canUseDom from './Dom/canUseDom';

export type PortalRef = {};

export interface PortalProps {
  didUpdate?: (prevProps: PortalProps) => void;
  getContainer: () => HTMLElement;
  children?: React.ReactNode;
}

const Portal = forwardRef<PortalRef, PortalProps>((props, ref) => {
  const { didUpdate, getContainer, children } = props;

  const containerRef = useRef<HTMLElement>();

  // Ref return nothing, only for wrapper check exist
  useImperativeHandle(ref, () => ({}));

  // Create container in client side with sync to avoid useEffect not get ref
  const initRef = useRef(false);
  if (!initRef.current && canUseDom()) {
    containerRef.current = getContainer();
    initRef.current = true;
  }

  // [Legacy] Used by `rc-trigger`
  useEffect(() => {
    didUpdate?.(props);
  });

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, []);

  return containerRef.current
    ? ReactDOM.createPortal(children, containerRef.current)
    : null;
});

export default Portal;