import React from 'react';
import { render, screen } from '@testing-library/react';
import SharedProfile from '../pages/SharedProfile';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

test('renders SharedProfile fallback when no profile', async () => {
  render(
    <MemoryRouter initialEntries={["/shared/unknown"]}>
      <Routes>
        <Route path="/shared/:userId" element={<SharedProfile />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(/Shared Profile|No shared profile found/i)).toBeTruthy();
});
