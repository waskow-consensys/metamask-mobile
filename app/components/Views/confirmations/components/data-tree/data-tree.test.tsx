import React from 'react';

import renderWithProvider from '../../../../../util/test/renderWithProvider';
import { backgroundState } from '../../../../../util/test/initial-root-state';
import DataTree, { DataTreeInput } from './data-tree';
import { PrimaryTypeOrder } from '../../constants/signatures';
import { NONE_DATE_VALUE } from '../../utils/date';

const timestamp = 1647359825; // March 15, 2022  15:57:05 UTC

const mockSanitizedTypedSignV3Message = {
  from: {
    value: {
      name: { value: 'Cow', type: 'string' },
      wallet: {
        value: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        type: 'address',
      },
    },
    type: 'Person',
  },
  to: {
    value: {
      name: { value: 'Bob', type: 'string' },
      wallet: {
        value: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        type: 'address',
      },
    },
    type: 'Person',
  },
  endTime: {
    value: timestamp.toString(),
    type: 'uint256',
  },
  startTime: {
    value: NONE_DATE_VALUE,
    type: 'uint256',
  },
  buyAmount: {
    value: 10000,
    type: 'uint256',
  },
  contents: { value: 'Hello, Bob!', type: 'string' },
};

describe('NoChangeSimulation', () => {
  it('should display types sign v1 message correctly', async () => {
    const { getByText } = renderWithProvider(
      <DataTree
        data={{
          Message: { type: 'string', value: 'Hi, Alice!' },
          'A number': { type: 'uint32', value: '1337' },
        }}
        chainId="0x1"
      />,
      {
        state: {
          engine: {
            backgroundState,
          },
        },
      },
    );
    expect(getByText('Message')).toBeDefined();
    expect(getByText('Hi, Alice!')).toBeDefined();
    expect(getByText('A Number')).toBeDefined();
    expect(getByText('1337')).toBeDefined();
  });

  it('displays types sign v3/v4 message', async () => {
    const { getByText, getAllByText } = renderWithProvider(
      <DataTree
        data={mockSanitizedTypedSignV3Message as unknown as DataTreeInput}
        chainId="0x1"
        primaryType={PrimaryTypeOrder.Order}
        tokenDecimals={2}
      />,
      {
        state: {
          engine: {
            backgroundState,
          },
        },
      },
    );
    expect(getAllByText('Name')).toHaveLength(2);
    expect(getAllByText('Wallet')).toHaveLength(2);
    expect(getByText('From')).toBeDefined();
    expect(getByText('Cow')).toBeDefined();
    expect(getByText('To')).toBeDefined();
    expect(getByText('Bob')).toBeDefined();
    // date field displayed for permit types
    expect(getByText('End Time')).toBeDefined();
    expect(getByText('15 March 2022, 15:57')).toBeDefined();
    expect(getByText('Start Time')).toBeDefined();
    expect(getByText('None')).toBeDefined();
    // token value field
    expect(getByText('Buy Amount')).toBeDefined();
    expect(getByText('100')).toBeDefined();
  });
});
