import { media } from '../media';
import { css } from 'styled-components/macro';
import { BreakpointWidths } from '../../types';

describe('media', () => {
  it('should return media query in css', () => {
    const mediaQuery = media.sm`color:red;`.join('');
    const cssVersion = css`
      @media (min-width: ${BreakpointWidths.sm}px) {
        color: red;
      }
    `.join('');
    expect(mediaQuery).toEqual(cssVersion);
  });
});
