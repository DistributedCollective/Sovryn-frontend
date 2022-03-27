import styled from 'styled-components/macro';
import { media } from '../../../../styles/media';

export const StyledTable = styled.table`
  font-weight: 200;
  width: 100%;
  font-size: 0.875rem;

  &.sovryn-table-mobile {
    font-size: 0.75rem;
  }
  .table-header div {
    font-weight: 400;
    color: white;
    font-size: 1rem;
    padding: 0 22px;
    height: 45px;
  }
  thead tr,
  .table-header:not(.sub-header) {
    height: 40px;
    th {
      font-weight: 400;
      color: white;
      font-size: 0.875rem;
      padding: 0 5px;
      height: 45px;
    }
  }
  tbody {
    tr {
      &:nth-child(odd) {
        td {
          background-color: #282828;
        }
      }
      td {
        &:first-child {
          border-radius: 0.375rem 0 0 0.375rem;
        }

        &:last-child {
          border-radius: 0 0.375rem 0.375rem 0;
        }

        &:only-child {
          border-radius: 0.375rem;
        }
      }
    }
  }
  &.table-small {
    thead tr {
      height: 30px;
      th {
        height: 30px;
        padding: 0 20px;
      }
    }
    tbody tr {
      height: 30px;
      td {
        padding: 0 20px;
      }
      &:nth-child(even) {
        td {
          background-color: #101010;
          &:first-child {
            border-radius: 0.375rem 0 0 0.375rem;
          }

          &:last-child {
            border-radius: 0 0.375rem 0.375rem 0;
          }

          &:only-child {
            border-radius: 0.375rem;
          }
        }
      }
    }
  }
  tbody tr,
  .mobile-row {
    height: 80px;

    td {
      padding: 0 5px;
      color: white;
    }

    &:first-of-type {
      border-top: none;
    }

    &.table-header {
      height: 60%;

      > td {
        font-weight: 400;
        color: white;
        font-size: 1rem;
        height: 45px;
        padding-top: 20px;
      }
    }
  }
  .mobile-row {
    align-content: center;
  }
  ${media.xl`
  thead tr,
  .table-header:not(.sub-header) {
    th {
      padding: 0 15px;
    }
  }
    tbody tr,
    .mobile-row {
      td {
        padding: 0 15px;
      }
    }
  `}
`;
