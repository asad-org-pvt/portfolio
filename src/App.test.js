import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio navigation and hero section', async () => {
  render(<App />);
  const homeNav = screen.getByText(/Home/i);
  expect(homeNav).toBeInTheDocument();

  const projectsNav = screen.getByText(/Projects/i);
  expect(projectsNav).toBeInTheDocument();

  const aboutNav = screen.getByText(/About/i);
  expect(aboutNav).toBeInTheDocument();
});

