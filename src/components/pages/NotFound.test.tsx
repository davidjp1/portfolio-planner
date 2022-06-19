import { render } from '@testing-library/react';
import { NotFound } from './NotFound';

test('renders 404', () => {
  const { getByText } = render(<NotFound />);
  expect(getByText('404')).toBeInTheDocument();
});
